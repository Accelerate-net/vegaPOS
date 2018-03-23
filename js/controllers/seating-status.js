/*REFERENCE:
Table Status 
0 - Free
1 - Punched Order
2 - Billed
5 - Reserved Table
*/


/*Open/Close Options*/
function openFreeSeatOptions(tableID){
	document.getElementById("freeSeatOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+tableID+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="punchNewOrder(\''+tableID+'\')"><i class="fa fa-plus" style=""></i><tag style="padding-left: 15px">Punch New Order</tag></button>'+ 
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="addToReserveListConsent(\''+tableID+'\')"><i class="fa fa-male" style=""></i><tag style="padding-left: 15px">Reserve this Table</tag></button>'+  
                  '<button class="btn btn-default tableOptionsButton" onclick="hideFreeSeatOptions()">Close</button>';
	document.getElementById("freeSeatOptionsModal").style.display ='block';
}

function hideFreeSeatOptions(){
	document.getElementById("freeSeatOptionsModal").style.display ='none';
}



function openReservedSeatOptions(tableID){
	document.getElementById("reservedSeatOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Reserved Table <b>'+tableID+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="punchNewOrder(\''+tableID+'\')"><i class="fa fa-plus" style=""></i><tag style="padding-left: 15px">Punch New Order</tag></button>'+ 
                  '<button class="btn btn-primary tableOptionsButtonBig" onclick="removeFromReserveList(\''+tableID+'\')"><i class="fa fa-check-square-o" style=""></i><tag style="padding-left: 15px">Free this Table</tag></button>'+  
                  '<button class="btn btn-default tableOptionsButton" onclick="hideReservedSeatOptions()">Close</button>';
	document.getElementById("reservedSeatOptionsModal").style.display ='block';
}

function hideReservedSeatOptions(){
	document.getElementById("reservedSeatOptionsModal").style.display ='none';
}




function openOccuppiedSeatOptions(tableInfo){

	var tableData = JSON.parse(decodeURI(tableInfo));

	if(tableData.status == 1){ /* Not Billed */
		document.getElementById("occuppiedSeatOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+tableData.table+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="editOrderKOT(\''+tableData.KOT+'\')"><i class="fa fa-pencil-square-o" style=""></i><tag style="padding-left: 15px">Edit Order</tag></button> '+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="generateBillFromKOT(\''+tableData.KOT+'\'); hideOccuppiedSeatOptions();"><i class="fa fa-file-text-o" style=""></i><tag style="padding-left: 15px">Generate Bill</tag></button> '+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="mergeDifferentBills(\''+tableData.table+'\')"><i class="fa fa-compress" style=""></i><tag style="padding-left: 15px">Merge Orders</tag></button> '+
                  '<button class="btn btn-danger tableOptionsButtonBig" onclick="cancelOrderKOT(\''+tableData.KOT+'\')"><i class="fa fa-ban" style=""></i><tag style="padding-left: 15px">Cancel Order</tag></button>'+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hideOccuppiedSeatOptions()">Close</button> ';
	}
	else if(tableData.status == 2){ /* Billed */
		document.getElementById("occuppiedSeatOptionsModalContent").innerHTML = '<h1 class="tableOptionsHeader">Table <b>'+tableData.table+'</b></h1>'+
                  '<button class="btn btn-success tableOptionsButtonBig" onclick="settlePrintedBill(\''+tableData.KOT+'\')"><i class="fa fa-credit-card" style=""></i><tag style="padding-left: 15px">Settle Bill</tag></button> '+ 
                  '<button class="btn btn-default tableOptionsButton" onclick="hideOccuppiedSeatOptions()">Close</button> ';
	}

	document.getElementById("occuppiedSeatOptionsModal").style.display ='block';
}

function hideOccuppiedSeatOptions(){
	document.getElementById("occuppiedSeatOptionsModal").style.display ='none';
}

/*seat options: actions*/
function editOrderKOT(kotID){

}

function confirmBillMergeFromKOT(kotList, mergedCart, mergedExtras, mergingTables){

	var kotID = kotList[0]; //Merge all to first KOT

	/*Read mentioned KOT - kotID*/
   if(fs.existsSync('./data/KOT/'+kotID+'.json')) {
      fs.readFile('./data/KOT/'+kotID+'.json', 'utf8', function readFileCallback(err, data){
    if (err){
        showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
    } else {
          var kotfile = JSON.parse(data);

          if(mergedCart && mergedCart.length > 0){
          	kotfile.cart = mergedCart;
          	kotfile.discount = {};
          	kotfile.extras = mergedExtras;
          }


          var json = JSON.stringify(kotfile); //convert it back to json
          var file = './data/KOT/'+kotID+'.json';
          fs.writeFile(file, json, 'utf8', (err) => {
              if(err){
				showToast('System Error: Unable to merge the orders. Please contact Accelerate Support.', '#e74c3c');
              }
              else{
              	showToast('Orders merged Successfully to Table '+mergingTables[0], '#27ae60');
              	cancelBillMerge();
              	generateBillFromKOT(kotID);

              	/*Remove all other KOTs*/
              	removeOtherKOTS(kotList);
              }
              	 
           });          

	}});
   } else {
      showToast('Error: Order was not found. Please contact Accelerate Support.', '#e74c3c');
   }  	

	hideOccuppiedSeatOptions();	
}

function removeOtherKOTS(kotList){ /*TWEAK*/
	
	            var h = 1; //Do not count first KOT
              	while(kotList[h]){
              		if(fs.existsSync('./data/KOT/'+kotList[h]+'.json')) {
	              		fs.unlinkSync('./data/KOT/'+kotList[h]+'.json')
	              	}
              		h++;
              	}




		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Failed to update table mapping. Please contact Accelerate Support.', '#e74c3c');
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          for(var i=0; i<tableMapping.length; i++){
	          	var n = 1; //Do not count first KOT
	          	while(kotList[n]){
		          	if(tableMapping[i].KOT == kotList[n]){
		          		tableMapping.splice(i,1);
		          		break;
		          	}
		          	
		          	n++;
		        }
	          }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Failed to update table mapping. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	preloadTableStatus();
		          }
		       }); 

		}
		});
	    } else {
	      showToast('System Error: Failed to update table mapping. Please contact Accelerate Support.', '#e74c3c');
	    }

}



function mergeDifferentBills(currentID){
	hideBillPreviewModal();
	hideOccuppiedSeatOptions();

	preloadTableStatus('MERGE_BILLS', currentID);	
}

function settlePrintedBill(kotID){
	//ask for payment mode, reference etc.
	//should release the table finally
}

function punchNewOrder(tableID){

}

function addToReserveListConsent(tableID){

	hideFreeSeatOptions();
	
	document.getElementById("addToReservedConsentModal").style.display = 'block';
	document.getElementById("addToReserveListConsentButton").innerHTML = '<button type="button" onclick="addToReserveList(\''+tableID+'\')" class="btn btn-success">Proceed and Reserve</button>';
	document.getElementById("addToReserveListConsentTitle").innerHTML = "Reserve Table #"+tableID;
	document.getElementById("reserve_table_in_the_name_of").value = '';

	$('#reserve_table_in_the_name_of').focus();
}

function addToReserveListConsentClose(){
	document.getElementById("addToReservedConsentModal").style.display = 'none';
}


function addToReserveList(tableID){

		addToReserveListConsentClose();
		var comments = document.getElementById("reserve_table_in_the_name_of").value;


		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to Reserve. Please contact Accelerate Support.', '#e74c3c');
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          var isUpdated = false;

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		if(tableMapping[i].status != 0){
	          			return '';
	          		}

	          		tableMapping[i].assigned = comments;
	          		tableMapping[i].KOT = "";
	          		tableMapping[i].status = 5;
	          		tableMapping[i].lastUpdate = "";

	          		isUpdated = true;

	          		break;
	          	}
	          }

	          if(!isUpdated){
	          	tableMapping.push({ "table": tableID, "assigned": comments, "KOT": "", "status": 5, "lastUpdate": "12:00 pm" });
		      }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to Reserve. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Table '+tableID+' has been marked as Reserved', '#27ae60');
		           	hideFreeSeatOptions();
		           	preloadTableStatus();

		        	}
		       }); 

		}
		});
	    } else {
	      showToast('System Error: Unable to Reserve. Please contact Accelerate Support.', '#e74c3c');
	    }
}

function removeFromReserveList(tableID){
		if(fs.existsSync('./data/static/tablemapping.json')) {
	      fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        showToast('System Error: Unable to free the Table. Please contact Accelerate Support.', '#e74c3c');
	    } else {
	    	if(data == ''){ data = '[]'; }
	          var tableMapping = JSON.parse(data); 

	          for(var i=0; i<tableMapping.length; i++){
	          	if(tableMapping[i].table == tableID){

	          		if(tableMapping[i].status != 5){
	          			return '';
	          		}

	          		tableMapping.splice(i,1);

	          		break;
	          	}
	          }

		       var newjson = JSON.stringify(tableMapping);
		       fs.writeFile('./data/static/tablemapping.json', newjson, 'utf8', (err) => {
		         if(err){
		            showToast('System Error: Unable to free the Table. Please contact Accelerate Support.', '#e74c3c');
		           }
		           else{
		           	showToast('Table '+tableID+' has been marked as Free', '#27ae60');
		           	hideReservedSeatOptions();
		           	preloadTableStatus();
		        	}
		       }); 

		}
		});
	    } else {
	      showToast('System Error: Unable to free the Table. Please contact Accelerate Support.', '#e74c3c');
	    }
}


function getTableStatus(tableID){
	/*returns table occupancy data*/
	if(!window.localStorage.tableMappingData){
		return '';
	}

	var tableMapData = JSON.parse(window.localStorage.tableMappingData);

	var n = 0;
	while(tableMapData[n]){
		if(tableMapData[n].table == tableID){
			return tableMapData[n];
		}
		n++;
	}

	return '';
}

function addToHoldList(id){
	var tempList = window.localStorage.billSelectionMergeHoldList ? JSON.parse(window.localStorage.billSelectionMergeHoldList): [];
	
	/*check if already clicked*/
	var alreadyAdded = false;
	var n = 0;
	while(tempList[n]){
		if(tempList[n] == id){
			tempList.splice(n,1);
			alreadyAdded = true;

			document.getElementById("hold_"+id).innerHTML = 'Order Punched';
			document.getElementById("holdMain_"+id).classList.remove('selectedExtra');	
					
			break;
		}
		n++;
	}

	if(!alreadyAdded){
		tempList.push(id);

		document.getElementById("hold_"+id).innerHTML = '<i class="fa fa-check"></i>';
		document.getElementById("holdMain_"+id).classList.add('selectedExtra');
	}

	if(tempList.length == 1){
		document.getElementById("confirmationRenderArea").innerHTML = '<p style="color: #FFF; margin: 30px; font-size: 21px; text-align: left;">Select Orders to Merge its Bills <button style="font-size: 18px" onclick="cancelBillMerge()" class="btn btn-default">Cancel</button></p>';	
	}
	else{
		document.getElementById("confirmationRenderArea").innerHTML = '<p style="color: #FFF; margin: 0; padding: 10px 120px 10px 30px !important; font-size: 21px; text-align: left;">The orders placed on Tables '+tempList.toString()+' will be merged as a single Bill on Table '+tempList[0]+'. This can not be revered.<br>Are you sure want to Merge Orders? <button class="btn btn-success" onclick="mergeBillsInTheHoldList()" style="font-size: 18px">Merge and Bill</button> <button onclick="cancelBillMerge()" style="font-size: 18px" class="btn btn-default">Cancel</button></p>';
	}

	
	window.localStorage.billSelectionMergeHoldList = JSON.stringify(tempList);

}

function cancelBillMerge(){
	window.localStorage.billSelectionMergeHoldList = '';
	preloadTableStatus();


	document.getElementById("confirmationRenderArea").style.display = 'none';
	document.getElementById("confirmationRenderArea").innerHTML = '';

}


function mergeBillsInTheHoldListAfterProcess(kotList, tableList) {

    var mergedCart = [];
    var mergedExtras = [];
    var kotCount = kotList.length;
    var kotCounter = 0;

    var n = 0;
    while (n < kotCount) {

        /*Read mentioned KOT hold list*/
        if (fs.existsSync('./data/KOT/' + kotList[n] + '.json')) {
            fs.readFile('./data/KOT/' + kotList[n] + '.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    showToast('Operation Aborted! Order ' + kotList[n] + ' was not found. Please contact Accelerate Support.', '#e74c3c');
                    return '';
                } else {
                	if(!data){ data = []}

                	kotCounter++;

                    var kotfile = JSON.parse(data);

                    /*Generate MERGED EXTRAS*/
                    var extraDuplicateFlag = false;
                    for (var g = 0; g < kotfile.extras.length; g++) {

                        var t = 0;
                        extraDuplicateFlag = false;

                        while (mergedExtras[t]) {
                                if (mergedExtras[t].name == kotfile.extras[g].name) {
                                    mergedExtras[t].amount += kotfile.extras[g].amount;
                                    extraDuplicateFlag = true;
                                    break;
                                }
                                t++
                        }

                        if (!extraDuplicateFlag) { //No duplicate, push the extra wholely.
                            mergedExtras.push(kotfile.extras[g]);
                        }        
                    }

                    /*Generate MERGED CART*/
                    var itemDuplicateFlag = false;

                    for (var f = 0; f < kotfile.cart.length; f++) {

                        var m = 0;
                        itemDuplicateFlag = false;

                        if (kotfile.cart[f].isCustom) {
                            while (mergedCart[m]) {
                                if (mergedCart[m].code == kotfile.cart[f].code && mergedCart[m].variant == kotfile.cart[f].variant) {
                                    mergedCart[m].qty += kotfile.cart[f].qty;
                                    itemDuplicateFlag = true;
                                    break;
                                }
                                m++
                            }
                        } else {
                            while (mergedCart[m]) {
                                if (mergedCart[m].code == kotfile.cart[f].code) {
                                    mergedCart[m].qty += kotfile.cart[f].qty;
                                    itemDuplicateFlag = true;
                                    break;
                                }
                                m++
                            }
                        }

                        if (!itemDuplicateFlag) { //No duplicate, push the item wholely.
                            mergedCart.push(kotfile.cart[f]);
                        }   


                        //End of iteration
                        if(kotCount == kotCounter){
                        	confirmBillMergeFromKOT(kotList, mergedCart, mergedExtras, tableList)
                        }           
                    }
                }
            });
        } else {
            showToast('Operation Aborted! Order ' + kotList[n] + ' was not found. Please contact Accelerate Support.', '#e74c3c');
        }


     n++;    
    }

}


function mergeBillsInTheHoldList(){
	var holdList = window.localStorage.billSelectionMergeHoldList ? JSON.parse(window.localStorage.billSelectionMergeHoldList): [];

	var KOTList = [];

			/*to find KOT IDs mapped against these tables*/
		    if(fs.existsSync('./data/static/tablemapping.json')) {
		        fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
		      if (err){
		          showToast('System Error: Unable to read Table Mapping data. Please contact Accelerate Support.', '#e74c3c');
		      } else {

		          if(data == ''){ data = '[]'; }

		              var tableMapping = JSON.parse(data);
		              tableMapping.sort(); //alphabetical sorting 

		              for (var i =0; i < holdList.length; i++){
			              var m = 0;
			              while(tableMapping[m]){
			              	if(holdList[i] == tableMapping[m].table){
			              		KOTList.push(tableMapping[m].KOT);
			              		break;
			              	}
			              	m++;
			              }		              	
		              }

		              mergeBillsInTheHoldListAfterProcess(KOTList, holdList); /* Merge KOTs*/


		    }
		    });
		      } else {
		        showToast('System Error: Unable to read Table Mapping. Please contact Accelerate Support.', '#e74c3c');
		      } 	
}

function preloadTableStatus(mode, currentTableID){
		    if(fs.existsSync('./data/static/tablemapping.json')) {
		        fs.readFile('./data/static/tablemapping.json', 'utf8', function readFileCallback(err, data){
		      if (err){
		          showToast('System Error: Unable to read Table Mapping data. Please contact Accelerate Support.', '#e74c3c');
		      } else {

		          if(data == ''){ data = '[]'; }

		              var tableMapping = JSON.parse(data);
		              tableMapping.sort(); //alphabetical sorting 

		              window.localStorage.tableMappingData = JSON.stringify(tableMapping);

		              renderCurrentPlan(mode, currentTableID);
		    }
		    });
		      } else {
		        showToast('System Error: Unable to read Table Mapping. Please contact Accelerate Support.', '#e74c3c');
		      } 	
}

function renderCurrentPlan(mode, currentTableID){

    if(fs.existsSync('./data/static/tables.json')) {
        fs.readFile('./data/static/tables.json', 'utf8', function readFileCallback(err, data){
      if (err){
          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } else {

          if(data == ''){ data = '[]'; }

              var tables = JSON.parse(data);
              tables.sort(); //alphabetical sorting 


		    if(fs.existsSync('./data/static/tablesections.json')) {
		        fs.readFile('./data/static/tablesections.json', 'utf8', function readFileCallback(err, data){
		      if (err){
		          showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
		      } else {

		          if(data == ''){ data = '[]'; }

		              var tableSections = JSON.parse(data);
		              tableSections.sort(); //alphabetical sorting 


		            if(mode == 'MERGE_BILLS'){

		            	if(currentTableID){
		            		window.localStorage.billSelectionMergeHoldList = JSON.stringify([currentTableID]);
		            	}
		            	else{
		            		window.localStorage.billSelectionMergeHoldList = JSON.stringify([]);
		            	}

		              var renderSectionArea = '';
		              
		              var totalTablesToMerge = 0;

		              var n = 0;
		              while(tableSections[n]){
		        
		              	var renderTableArea = ''
		              	for(var i = 0; i<tables.length; i++){
		              		if(tables[i].type == tableSections[n]){

		              			var tableOccupancyData = getTableStatus(tables[i].name);

		              			if(tableOccupancyData){ /*Occuppied*/
									if(tableOccupancyData.status == 1){

										if(tables[i].name == currentTableID){

											totalTablesToMerge++;

											renderTableArea = renderTableArea + '<tag class="tableTileRed selected">'+
																	            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																	            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
																	            '<tag class="tableInfo" style="color: #fff"><i class="fa fa-check"></i></tag>'+
																	        	'</tag>';	
										}
										else{

											totalTablesToMerge++;

				              				renderTableArea = renderTableArea + '<tag id="holdMain_'+tables[i].name+'" onclick="addToHoldList(\''+tables[i].name+'\')" class="tableTileRed">'+
																	            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
																	            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
																	            '<tag class="tableInfo" id="hold_'+tables[i].name+'" style="color: #fff">Punched '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
																	        	'</tag>';												
										}

									}	
									else if(tableOccupancyData.status == 2){
		              				renderTableArea = renderTableArea + '<tag class="tableTileOther">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
															            '<tag class="tableInfo">Billed '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
															        	'</tag>';	
									}	
									else if(tableOccupancyData.status == 5){
		              				renderTableArea = renderTableArea + '<tag class="tableTileOther">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
															            '<tag class="tableInfo">Reserved</tag>'+
															        	'</tag>';	
									}																									
									else{
		              				renderTableArea = renderTableArea + '<tag class="tableTileOther">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
															            '<tag class="tableInfo">Updated '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
															        	'</tag>';											
									}


		              			}
		              			else{

		              				renderTableArea = renderTableArea + '<tag class="tableTileOther">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
															            '<tag class="tableInfo">Free</tag>'+
															        	'</tag>';		              				
		              			}

		              		}
		              	}

		              	renderSectionArea = renderSectionArea + '<div class="row" style="margin-top: 25px">'+
												   '<h1 class="seatingPlanHead">'+tableSections[n]+'</h1>'+
												   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
												    '</div>'+
												'</div>'

		              	n++;
		              }

		              if(totalTablesToMerge < 2){
		              	showToast('Warning: Atleast two live orders needed to perform Merge Operation', '#e67e22');
		              	cancelBillMerge();
		              	return '';
		              }

		              document.getElementById("fullSeatingRenderArea").innerHTML = renderSectionArea;

		              document.getElementById("confirmationRenderArea").style.display = 'block';
		              document.getElementById("confirmationRenderArea").style.background = '#3498db';
		              document.getElementById("confirmationRenderArea").innerHTML = '<p style="color: #FFF; margin: 30px; font-size: 21px; text-align: left;">Select Orders to Merge Bills <button style="font-size: 18px" class="btn btn-default" onclick="cancelBillMerge()">Cancel</button></p>';

		            }
		            else{
		              var renderSectionArea = '';

		              var n = 0;
		              while(tableSections[n]){
		        
		              	var renderTableArea = ''
		              	for(var i = 0; i<tables.length; i++){
		              		if(tables[i].type == tableSections[n]){

		              			var tableOccupancyData = getTableStatus(tables[i].name);

		              			if(tableOccupancyData){ /*Occuppied*/
									if(tableOccupancyData.status == 1){
		              				renderTableArea = renderTableArea + '<tag onclick="openOccuppiedSeatOptions(\''+encodeURI(JSON.stringify(tableOccupancyData))+'\')" class="tableTileRed">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
															            '<tag class="tableInfo">Punched '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
															        	'</tag>';	
									}
									else if(tableOccupancyData.status == 2){
		              				renderTableArea = renderTableArea + '<tag onclick="openOccuppiedSeatOptions(\''+encodeURI(JSON.stringify(tableOccupancyData))+'\')" class="tableTileYellow">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
															            '<tag class="tableInfo">Billed '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
															        	'</tag>';	
									}
									else if(tableOccupancyData.status == 5){
		              				renderTableArea = renderTableArea + '<tag onclick="openReservedSeatOptions(\''+tables[i].name+'\')" class="tableReserved">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ""? "For "+tableOccupancyData.assigned : "-")+'</tag>'+
															            '<tag class="tableInfo">Reserved</tag>'+
															        	'</tag>';	
									}									
									else{
		              				renderTableArea = renderTableArea + '<tag onclick="openOccuppiedSeatOptions(\''+encodeURI(JSON.stringify(tableOccupancyData))+'\')" class="tableTileRed">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+(tableOccupancyData.assigned != ''? tableOccupancyData.assigned: '-')+'</tag>'+
															            '<tag class="tableInfo">Updated '+getFormattedTime(tableOccupancyData.lastUpdate)+' ago</tag>'+
															        	'</tag>';											
									}


		              			}
		              			else{

		              				renderTableArea = renderTableArea + '<tag onclick="openFreeSeatOptions(\''+tables[i].name+'\')" class="tableTileGreen">'+
															            '<tag class="tableTitle">'+tables[i].name+'</tag>'+
															            '<tag class="tableCapacity">'+tables[i].capacity+' Seater</tag>'+
															            '<tag class="tableInfo">Free</tag>'+
															        	'</tag>';		              				
		              			}

		              		}
		              	}

		              	renderSectionArea = renderSectionArea + '<div class="row" style="margin-top: 25px">'+
												   '<h1 class="seatingPlanHead">'+tableSections[n]+'</h1>'+
												   '<div class="col-lg-12" style="text-align: center;">'+renderTableArea+
												    '</div>'+
												'</div>'

		              	n++;
		              }
		              document.getElementById("fullSeatingRenderArea").innerHTML = renderSectionArea;		            	
		            }
		    }
		    });
		      } else {
		        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
		      } 

    }
    });
      } else {
        showToast('System Error: Unable to read Tables data. Please contact Accelerate Support.', '#e74c3c');
      } 

}