const settings = require('electron-settings')

let $ = require('jquery');
let currentRunningPage = '';

/*
	* 	Link all the pages in this file.
	*	renderPage loads the view from its template.
	* 	fetchInitFunctions contains the list of functions to be called, 
		while that particular page is loaded.
*/

function fetchInitFunctions(pageReference){
	
  currentRunningPage = pageReference;


  // LOGGED IN USER INFO
  var loggedInStaffInfo = window.localStorage.loggedInStaffData ? JSON.parse(window.localStorage.loggedInStaffData): {};
        
  if(jQuery.isEmptyObject(loggedInStaffInfo)){
    loggedInStaffInfo.name = "";
    loggedInStaffInfo.code = "";
    loggedInStaffInfo.role = "";
  }

  //either profile not chosen, or not an admin
  var isUserAnAdmin = false
  if(loggedInStaffInfo.code != '' && loggedInStaffInfo.role == 'ADMIN'){ 
    isUserAnAdmin = true;
  }


  if(isUserAnAdmin){
	switch (pageReference){
		case 'new-order':{
			triggerRightPanelDisplay();
			renderCustomerInfo();
			initMenuSuggestion();
			initOrderPunch();
			break;
		}
		case 'live-orders':{
			renderAllKOTs();
			break;
		}
		case 'online-orders':{
			renderOnlineOrders();
			break;
		}
		case 'settled-bills':{
			loadAllPendingSettlementBills('EXTERNAL', 'LOADING_ANIMATION');
			break;
		}	
		case 'expenses-and-payments':{
			loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
			break;
		}	
		case 'cancelled-bills':{
			loadAllCancelledUnbilled('EXTERNAL');
			break;
		}			
		case 'seating-status':{
			preloadTableStatus();
			break;
		}
		case 'reward-points':{
			renderDefaults();
			break;
		}				
		case 'sales-summary':{
			setSummaryDateRange();
			break;
		}
		case 'manage-menu':{
			fetchAllCategories();
			break;
		}	
		case 'photos-manager':{
			fetchAllCategoriesPhotos();
			break;
		}			
		case 'table-layout':{
			fetchAllTables()
			fetchAllTableSections()
			break;
		}
		case 'bill-settings':{
			break;
		}				
		case 'user-settings':{
			fetchAllUsersInfo();
			break;
		}	
		case 'printer-settings':{
			fetchAllPrintersInfo();
			break;
		}	
		case 'app-data':{

			break;
		}
		case 'system-settings':{

			break;
		}
	}
  }
  else{ // NON - ADMIN PAGES ONLY
	switch (pageReference){
		case 'new-order':{
			triggerRightPanelDisplay();
			renderCustomerInfo();
			initMenuSuggestion();
			initOrderPunch();
			break;
		}
		case 'live-orders':{
			renderAllKOTs();
			break;
		}
		case 'settled-bills':{
			loadAllPendingSettlementBills('EXTERNAL');
			break;
		}		
		case 'seating-status':{
			preloadTableStatus();
			break;
		}
		default:{ //If page not authorised to access, go to HOME (punch order page)
			renderPage('new-order', 'Punch Order');
		}
	}
  } //End - else
}


function renderPage(pageReference, title){

	if(!title || title == ''){

		switch (pageReference){
			case 'new-order':{
				title = 'Punch Order';
				break;
			}
			case 'live-orders':{
				title = 'Live Orders';
				break;
			}
			case 'online-orders':{
				title = 'Online Orders';
				break;
			}
			case 'settled-bills':{
				title = 'Generated Bills';
				break;
			}
			case 'expenses-and-payments':{
				title = 'Expenses & Payments';
				break;
			}	
			case 'cancelled-bills':{
				title = 'Cancellations';
				break;
			}			
			case 'seating-status':{
				title = 'Seating Status';
				break;
			}
			case 'reward-points':{
				title = 'Reward Points';
				break;
			}				
			case 'sales-summary':{
				title = 'Reports & Summary';
				break;
			}
			case 'manage-menu':{
				title = 'Manage Menu';
				break;
			}	
			case 'photos-manager':{
				title = 'Photos Manager';
				break;
			}			
			case 'table-layout':{
				title = 'Table Layout';
				break;
			}
			case 'bill-settings':{
				title = 'Billing Settings';
				break;
			}				
			case 'user-settings':{
				title = 'User Settings';
				break;
			}	
			case 'printer-settings':{
				title = 'Configure Printers';
				break;
			}	
			case 'app-data':{
				title = 'App Data';
				break;
			}
			case 'system-settings':{
				title = 'System Settings';
				break;
			}
			default:{
				title = 'POS';
			}
		}
	}

	const links = document.querySelectorAll('link[for="'+pageReference+'"]')

	if(links.length == 1){
		  // Import and add  page to the DOM
		  let template = links[0].import.querySelector('.task-template')
		  let clone = document.importNode(template.content, true)

		  document.querySelector('.content').innerHTML = '';
		  document.querySelector('.content').appendChild(clone);
		  document.getElementById("renderPageTitle").innerHTML = title;

		  fetchInitFunctions(pageReference);


	}else{
		document.querySelector('.content').innerHTML = "Error while loading the view. Please contact Accelerate Support (support@accelerate.net.in)";
	}
}

//Default View
renderPage('sales-summary', 'Punch Order');