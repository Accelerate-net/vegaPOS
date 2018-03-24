
function fetchSalesSummary(fromDate, toDate) {

	//Note: Dates in YYYYMMDD format

	//Default - today's summary
	if(!fromDate || fromDate == '' || !toDate || toDate == ''){
		fromDate = getCurrentTime('DATE_STAMP');
		toDate = fromDate;
	}


	fromDate = '20180320';
	toDate = '20180324';


		/*
			Summary - PAYMENT MODE wise
		*/

		if(fs.existsSync('./data/static/paymentmodes.json')) {
	      fs.readFile('./data/static/paymentmodes.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	        
	    } else {

	          	var modes = JSON.parse(data);
	          	modes.sort(); //alphabetical sorting 


	          	//For a given PAYMENT MODE, the total Sales in the given DATE RANGE
	          	var n = 0;
	          	while(modes[n]){

				  $.ajax({
				    type: 'GET',
				    url: COMMON_LOCAL_SERVER_IP+'/zaitoon_invoices/_design/invoice-summary/_view/sumbymode?startkey=["'+modes[n].code+'","'+fromDate+'"]&endkey=["'+modes[n].code+'","'+toDate+'"]',
				    timeout: 10000,
				    success: function(data) {
				    	//console.log('>>> Mode: '+modes[n].name)
				    	if(data.rows.length > 0){
				    		var result = data.rows[0].value;
				    		console.log(result.sum)
				    	}
				    	else{
				    		console.log('No Results')
				    	}
				    	
				    },
				    error: function(data){

				    }
				  });  

				  n++;
				}

		}
		});
	    } 

}


//http://127.0.0.1:5984/zaitoon_invoices/_design/accelerate/_view/invoices?startkey=%2220180320%22&endkey=%2220180323%22