

function openOtherMappedMenu(menuTypeCode){

  var systemMenu = '';
  var mappedMenu = '';

  var formatted_name_menu = ((menuTypeCode).toLowerCase());

  document.getElementById("mappedMenuHeadTitle").innerHTML = 'Mapped <tag style="text-transform:capitalize">'+formatted_name_menu+'</tag> Menu';


  preloadSystemMenu();

  function preloadSystemMenu(){

      var requestData = {
        "selector"  :{ 
                      "identifierTag": "ACCELERATE_MASTER_MENU" 
                    },
        "fields"    : ["_rev", "identifierTag", "value"]
      }

      $.ajax({
        type: 'POST',
        url: COMMON_LOCAL_SERVER_IP + '/accelerate_settings/_find',
        data: JSON.stringify(requestData),
        contentType: "application/json",
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if(data.docs.length > 0){
            if(data.docs[0].identifierTag == 'ACCELERATE_MASTER_MENU'){

                var mastermenu = data.docs[0].value;
                var list = [];
          
                for (var i=0; i<mastermenu.length; i++){
                  for(var j=0; j<mastermenu[i].items.length; j++){
                    list[mastermenu[i].items[j].code] = mastermenu[i].items[j];
                    list[mastermenu[i].items[j].code].category = mastermenu[i].category;
                  }         
                }

                systemMenu = list;
                preloadMenuMappings();

            }
            else{
              showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
              preloadMenuMappings();
            }
          }
          else{
            showToast('Not Found Error: Menu data not found. Please contact Accelerate Support.', '#e74c3c');
            preloadMenuMappings();
          }
          
        },
        error: function(data) {
          showToast('System Error: Unable to read Menu data. Please contact Accelerate Support.', '#e74c3c');
          preloadMenuMappings();
        }

      });   
  }


  function preloadMenuMappings(){

    $.ajax({
      type: 'GET',
      url: COMMON_LOCAL_SERVER_IP+'/accelerate_other_menu_mappings/MENU_'+menuTypeCode+'/',
      timeout: 10000,
      success: function(data) {
        if(data._id != ""){

            var otherMenu = data;
            mappedMenu = data.value;

            proceedToValidation();

        }
        else{
          proceedToValidation();
        }
      },
      error: function(data) {
        showToast('System Error: <b>'+menuTypeCode+'</b> Menu data not found. Please contact Accelerate Support.', '#e74c3c');
        return '';
      }

    });   

  }


  function proceedToValidation(){

    var otherMenuData = mappedMenu;
    var renderContent = '';

    for(var n = 0; n < otherMenuData.length; n++){

      var systemItem = getSystemEquivalentItem(otherMenuData[n].systemCode, otherMenuData[n].systemVariant);
        
      if(systemItem == "NOT_FOUND"){

        if(otherMenuData[n].systemCode == ""){
        
          renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                            '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+(n+1)+'</td>'+
                            '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+otherMenuData[n].mappedName+'</td>'+
                            '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+ 
                            '<td '+(n%2 == 0 ? 'style="background: #fbfbfb; color: red;"' : 'style="color: red"')+'><i class="fa fa-warning"></i></td>'+
                            '<td style="background: red; color: #FFF; text-align: right;"></td>'+
                            '<td style="background: red; color: #FFF"><b>Not Mapped</b></td>'+
                            '<td style="background: red;"></td>'+
                          '</tr>';
        }
        else{
          renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+(n+1)+'</td>'+
                          '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+otherMenuData[n].mappedName+'</td>'+
                          '<td '+(n%2 == 0 ? 'style="background: #fbfbfb;"' : '')+'>'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td '+(n%2 == 0 ? 'style="background: #fbfbfb; color: red"' : 'style="color: red"')+'><i class="fa fa-warning"></i></td>'+
                          '<td style="background: red; color: #FFF; text-align: right;"><b>'+otherMenuData[n].systemCode+'</b></td>'+
                          '<td style="background: red; color: #FFF"><b>Incorrect Mapping</b></td>'+
                          '<td style="background: red;"></td>'+
                        '</tr>';
        }
      }
      else{

        var equivalent_variant = "";
        var equivalent_price = "";

        if(systemItem.isCustom && otherMenuData[n].systemVariant != ""){
          for(var i = 0; i < systemItem.customOptions.length; i++){
            if(systemItem.customOptions[i].customName == otherMenuData[n].systemVariant){
              equivalent_variant = systemItem.customOptions[i].customName;
              equivalent_price = systemItem.customOptions[i].customPrice;
              break;
            }
          }

          if(equivalent_variant == ""){
            equivalent_variant = "VARIANT_MISMATCH";
          }
        }
        else if(systemItem.isCustom && otherMenuData[n].systemVariant == ""){
          equivalent_variant = "VARIANT_MISMATCH";
        }

        renderContent += '<tr role="row" class="selectMappedRow" style="cursor: pointer" onclick="openItemForEditing('+n+')">'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(n+1)+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+otherMenuData[n].mappedName+'</td>'+
                          '<td style="color: #526079;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(otherMenuData[n].mappedPrice != "" ? '<i class="fa fa-inr"></i>'+otherMenuData[n].mappedPrice : '-')+'</td>'+
                          '<td style="color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'"><i class="fa fa-long-arrow-right"></i></td>'+
                          '<td style="text-align: right; font-weight: bold; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.code+'</td>'+
                          '<td style="font-weight: 400; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+systemItem.name + (equivalent_variant != "" ? (equivalent_variant == "VARIANT_MISMATCH" ? ' <tag class="mappedInvalidVariant">INVALID VARIANT</tag>' : ' <tag class="mappedVariantTag">('+equivalent_variant+')</tag>') : '')+'</td>'+
                          '<td style="text-align: right; color: #1abc62;'+(n%2 == 0 ? 'background: #fbfbfb;' : '')+'">'+(systemItem.isCustom ? (equivalent_price != "" ? '<i class="fa fa-inr"></i>'+equivalent_price : "") : '<i class="fa fa-inr"></i>'+systemItem.price)+'</td>'+
                        '</tr>';

      }
    } 

    if(renderContent == ""){
      renderContent = '<p style="margin: 30px 0 0 0; text-align: center; color: #ccc;">Oops! Validator did not return any results.</p>';
    }
    else{
      renderContent = '<tr>'+ 
                        '<td style="color: #FFF; background: #526079; font-weight: bold">#</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Name</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold; text-transform: capitalize">'+formatted_name_menu+' Price</td>'+
                        '<td style="color: #FFF; background: #526079; font-weight: bold"></td>'+
                        '<td colspan="3" style="color: #FFF; background: #1abc62; font-weight: bold; text-align: center;">System Mapping</td>'+
                      '</tr>'+ renderContent;
    }


    document.getElementById("mappedMenuValidationResultsWindow").style.display = 'block';
    document.getElementById("mappedMenuValidationResultsContent").innerHTML = renderContent;
  }


  function getSystemEquivalentItem(code, variant){

    var systemDefaultItem = '';

    if(systemMenu[code]){
      systemDefaultItem = systemMenu[code];
    }
    else{
      systemDefaultItem = "NOT_FOUND";
    }


    return systemDefaultItem;
  }

}

