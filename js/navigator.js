const settings = require('electron-settings')

let $ = require('jquery');

/*
	* 	Link all the pages in this file.
	*	renderPage loads the view from its template.
	* 	fetchInitFunctions contains the list of functions to be called, 
		while that particular page is loaded.
*/

function fetchInitFunctions(pageReference){
	switch (pageReference){
		case 'new-order':{
			renderMenu();
			renderCustomerInfo();
			initMenuSuggestion();
			initOrderPunch();
			break;
		}
		case 'live-orders':{
			renderKOT();
			break;
		}
		case 'online-orders':{
			renderOnlineOrders();
			break;
		}
		case 'settled-bills':{

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
		case 'app-data':{

			break;
		}
		case 'system-settings':{

			break;
		}
	}
}


function renderPage(pageReference, title){
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
renderPage('seating-status', 'New Order');


const ipc = require('electron').ipcRenderer;
const printPDFButton = document.getElementById("print-pdf");

printPDFButton.addEventListener('click', function(event){
	console.log(event)
	ipc.send('print-to-pdf');
});

/* Printer */
