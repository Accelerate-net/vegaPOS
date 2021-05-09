
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
      url: ACCELERON_SERVER_ENDPOINT+'/table/filter?key=all',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
          var tableData = result.data;
          if(tableData.length == 0){
            document.getElementById("allTablesList").innerHTML = '<p style="color: #bdc3c7">No Table added yet.</p>';
            return '';
          }

          tableData.sort(function(obj1, obj2) {
            return obj1.key - obj2.key; //Key is equivalent to sortIndex
          });
           
          var tablesList = '';
          for (var i=0; i<tableData.length; i++){
            tablesList = tablesList + '<tr role="row"> <td>'+tableData[i].sortIndex+'</td> <td>'+(tableData[i].status == 0 ? '<i class="fa fa-circle" style="color: #2ecc71; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>' : (tableData[i].status == 1 ? '<i class="fa fa-circle" style="color: #e74c3c; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>' : '<i class="fa fa-circle" style="color: #ecaa40; padding-right: 7px; font-size: 75%; position: relative; top: -1px;"></i></i>'))+'<b style="font-size: 120%">'+tableData[i].table+'</b></td> <td style="text-align: center">'+tableData[i].type+'</td> <td style="text-align: center">'+tableData[i].capacity+'</td> <td onclick="deleteSingleTableConsent(\''+tableData[i].table+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
          }

          document.getElementById("allTablesList").innerHTML = '<thead style="background: #f4f4f4;"> <tr> <th style="text-align: left">Index</th> <th style="text-align: left">Table</th> <th style="text-align: center">Section</th> <th style="text-align: center">Capacity</th> <th style="text-align: left"></th> </tr> </thead> <tbody>'+
                                    '<tbody>'+tablesList+'</tbody>';    
        }
        else{
          showNotification('NOT_FOUND_ERROR', 'Tables data not found');
        }
      },
      error: function(error) {
        showNotification('SERVER_ERROR', 'Unable to read Tables data', error);
      }
    });
}


function fetchAllTableSections(){
    $.ajax({
      type: 'GET',
      url: ACCELERON_SERVER_ENDPOINT+'/settings/ACCELERATE_TABLE_SECTIONS',
      timeout: 10000,
      beforeSend: function(xhr){
        xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
      },
      success: function(result) {
        if(result.code == 200 && result.msg == "success"){
              var table = result.data.value;
              //alphabetical sorting 
              table.sort(function (a, b) {
                  return a.toLowerCase().localeCompare(b.toLowerCase());
              });
              var tablesList = '';

              for (var i=0; i<table.length; i++){
                tablesList = tablesList + '<tr> <td style="text-align: left;font-size: 16px;font-family: \'Oswald\';">'+table[i]+'</td> <td style="text-align: right; cursor: pointer" onclick="deleteSingleTableSectionConsent(\''+table[i]+'\')"> <i class="fa fa-trash-o"></i> </td> </tr>';
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
          showNotification('NOT_FOUND_ERROR', 'Table Sections data not found');
        }
      },
      error: function(error) {
        showNotification('SERVER_ERROR', 'Unable to read Table Sections data', error);
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
  var requestData = {
    'delete_table_name' : name,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/table/delete',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllTables();
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete table');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Tables data', error);
    }
  });  

  cancelTableDeleteConfirmation();
}


function deleteSingleTableSectionConsent(name){
  openTableDeleteConfirmation(name, 'deleteSingleTableSection', 'All the Tables mapped to the Section <b>'+name+'</b> will also get deleted.');
}


/* delete a table section */
function deleteSingleTableSection(sectionName) {  
  var requestData = {
    'delete_section_name' : sectionName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/table/section/delete',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        fetchAllTableSections();
        fetchAllTables();
      }
      else{
        showNotification('DELETE_ERROR', 'Unable to delete table section');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to make changes in Tables data', error);
    }
  });  

  cancelTableDeleteConfirmation();    
}


function addNewTableSection(){
   
  var sectionName = document.getElementById("add_new_tableSection_name").value;
  sectionName = sectionName.trim();
  if(sectionName == ''){ 
    showToast('Warning: Please set a name', '#e67e22');
    return '';
  }

  var requestData = {
    'section_name' : sectionName,
  }
  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/table/section/new',
    data: JSON.stringify(requestData),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        hideNewTableSectionModal();
        fetchAllTableSections();
      }
      else{
        showNotification('CREATE_ERROR', 'Unable to add new Table Section');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to update Table Sections data', error);
    }
  });
}


function addNewTable() {  
  
  var paramObj = {};
  paramObj.table = document.getElementById("add_new_table_name").value;
  paramObj.capacity = document.getElementById("add_new_table_capacity").value;
  paramObj.type = document.getElementById("add_new_table_type").value;
  paramObj.sortIndex = document.getElementById("add_new_table_sortIndex").value;
  paramObj.table = paramObj.table.trim();

  if(Number.isNaN(paramObj.capacity)){
    showToast('Warning: Invalid Capacity value. It has to be a Number.', '#e67e22');
    return '';
  } 
  else if(paramObj.table == '') {
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

  $.ajax({
    type: 'POST',
    url: ACCELERON_SERVER_ENDPOINT+'/table/create',
    data: JSON.stringify(paramObj),
    contentType: "application/json",
    dataType: 'json',
    timeout: 10000,
    beforeSend: function(xhr){
      xhr.setRequestHeader('x-access-token', ACCELERON_SERVER_ACCESS_TOKEN);
    },
    success: function(result) {
      if(result.code == 200 && result.msg == "success"){
        hideNewTableModal();
        fetchAllTables();
      }
      else{
        showNotification('CREATE_ERROR', 'Unable to create new table');
      }
    },
    error: function(error) {
      showNotification('SERVER_ERROR', 'Unable to create new table', error);
    }
  });
}