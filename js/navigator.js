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
			checkIfAccessGranted('Expenses & Payments');
			loadAllAddedExpenses('EXTERNAL', 'LOADING_ANIMATION');
			break;
		}	
		case 'cancelled-bills':{
			checkIfAccessGranted('Cancellations');
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
			checkIfAccessGranted('Reports & Summary');
			setSummaryDateRange();
			break;
		}
		case 'manage-menu':{
			checkIfAccessGranted('Manage Menu');
			break;
		}	
		case 'master-menu':{
			checkIfAccessGranted('Master Menu');
			fetchAllCategories();
			break;
		}	
		case 'mapped-menus':{
			checkIfAccessGranted('Mapped Menus');
			break;
		}	
		case 'menu-photos':{
			checkIfAccessGranted('Menu Photos');
			fetchAllCategoriesPhotos();
			break;
		}
		case 'menu-settings':{
			checkIfAccessGranted('Menu Settings');
			break;
		}				
		case 'table-layout':{
			checkIfAccessGranted('Table Layout');
			fetchAllTables()
			fetchAllTableSections()
			break;
		}
		case 'bill-settings':{
			checkIfAccessGranted('Billing Settings');
			break;
		}				
		case 'user-settings':{
			checkIfAccessGranted('User Settings');
			fetchAllUsersInfo();
			break;
		}	
		case 'printer-settings':{
			checkIfAccessGranted('Configure Printers');
			fetchAllPrintersInfo();
			break;
		}	
		case 'app-data':{
			checkIfAccessGranted('App Data');
			break;
		}
		case 'system-settings':{
			checkIfAccessGranted('System Settings');
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


//To check if access is granted
function checkIfAccessGranted(optionalPage){

	var isSettingsPagesRestricted = window.localStorage.appCustomSettings_PagesProtection && window.localStorage.appCustomSettings_PagesProtection == 'true' ? true : false;

	if(!isSettingsPagesRestricted){
		return '';
	}

	if(!window.localStorage.isAccessGrantedToSettings || window.localStorage.isAccessGrantedToSettings == ''){
		askForSettingsPasscode(optionalPage);
	}
	else{
		var recorded_time = moment(window.localStorage.isAccessGrantedToSettings);
		var difference = moment.duration(moment().diff(recorded_time));
		difference = difference.asSeconds();

		if(difference >= 180){ //already lapsed 3 minutes allowed
			window.localStorage.isAccessGrantedToSettings = '';
			askForSettingsPasscode(optionalPage);
		}
		else{
			//Update granted time durations
			window.localStorage.isAccessGrantedToSettings = moment().format();
		}
	}
}



function renderPage(pageReference, title){

	window.localStorage.last_visited_page_remember = pageReference;


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
			case 'master-menu':{
				title = 'Master Menu';
				break;
			}	
			case 'menu-photos':{
				title = 'Menu Photos';
				break;
			}
			case 'mapped-menus':{
				title = 'Mapped Menus';
				break;
			}
			case 'menu-settings':{
				title = 'Menu Settings';
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
if(window.localStorage.last_visited_page_remember && window.localStorage.last_visited_page_remember != ''){
	renderPage(window.localStorage.last_visited_page_remember);
}
else{
	renderPage('new-order', 'Punch Order');
}