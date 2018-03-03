function openLoginModal(){
	document.getElementById("loginModal").style.display = "block";
}

function hideLoginModal(){
	document.getElementById("loginModal").style.display = "none";
}


function openCouponRedeemModal(data){
	document.getElementById("couponRedeemConfirmation").innerHTML = '<p style="font-size: 18px; font-weight: bold; padding-left: 5px; color: #1abc9c;">'+data.brief+'</p>'+
							'<table class="table" style="margin: 0"> <tbody> <tr> <td style="border-top: none">Issued To</td> <td style="border-top: none;">'+data.issuedTo+'</td> </tr>'+
							'<tr> <td>Total Value</td> <td style="font-size: 21px; font-weight: bold; color: #1abc9c"><i class="fa fa-inr"></i>'+data.totalValue+'</td> </tr><tr> <td>Minimum Bill Amount</td> <td><i class="fa fa-inr"></i>'+data.minBill+'</td> </tr> <tr> <td style="color: #e74c3c">Expiry Date</td> <td style="color: #e74c3c">'+data.expiry+'</td> </tr>'+
							'</tbody> </table> <p style="color: gray; padding-left: 8px; margin: 0; padding-top: 15px">Issued by '+data.issuedAdmin+' at '+data.issuedOutlet+' on '+data.issuedDate+'</p>';
	document.getElementById("couponRedeemModal").style.display = "block";
}

function hideCouponRedeemModal(){
	document.getElementById("couponRedeemModal").style.display = "none";
}


/*to redeem coupon entered*/
function processRedeemCoupon(){
	alert('Code to be Written!')
	hideCouponRedeemModal();
}


function doLogin(){
	var username = document.getElementById("login_server_username").value;
	var password = document.getElementById("login_server_password").value;

	var data = {
		"mobile": username,
		"password": password
	}

	$.ajax({
		type: 'POST',
		url: 'https://www.zaitoon.online/services/adminlogin.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(data) {
			if(data.status){
				window.localStorage.loggedInAdmin = data.response;
				showToast('Succesfully logged in to '+data.branch, '#27ae60');
				hideLoginModal();
				renderDefaults();
			}
			else
			{
				showToast(data.error, '#e74c3c');
			}

		}
	});		

}


function forceLogout(customeError){
	window.localStorage.loggedInAdmin = "";
	renderDefaults();

	/*clear previous search*/
	document.getElementById("renderAreaUserInfo").innerHTML = "";
	document.getElementById("renderAreaUserStats").innerHTML = "";	
	
	if(customeError)
		showToast(customeError, '#e74c3c');
	else
		showToast('You have been logged out', '#e74c3c');
}


/*To render errors - check if logged in*/
function renderDefaults(){

	if(window.localStorage.loggedInAdmin){
		document.getElementById("errorRenderArea").innerHTML = '<p style="color: gray; font-size: 16px; font-weight: 300; text-align: center;">Enter the Coupon/Voucher Code or the Customer\'s Registered Mobile Number</p>'
	}
	else{
		document.getElementById("errorRenderArea").innerHTML = '<p style="color: #dd4b39; font-size: 18px; font-weight: 400; text-align: center;">Please <tag class="extrasSelButton" style="font-size: 16px" onclick="openLoginModal()">Login</tag> to the Server to Continue</p>';
	}
}



function searchRequest(){

	if(!window.localStorage.loggedInAdmin){
		return '';
	}

	/*clear previous search*/
	document.getElementById("renderAreaUserInfo").innerHTML = "";
	document.getElementById("renderAreaUserStats").innerHTML = "";


	var user = document.getElementById("rewardsSearchInput").value;


	var data = {
		"token": window.localStorage.loggedInAdmin,
		"id": 0,
		"key": user
	}

	$.ajax({
		type: 'POST',
		url: 'https://www.zaitoon.online/services/possearchrewards.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(data) {
			if(data.status){
				if(data.type == 'REDEEM'){
					openCouponRedeemModal(data.couponData);
					return '';
				}
				renderHistory(data, user);
				renderDefaults();
			}
			else
			{
				document.getElementById("errorRenderArea").innerHTML = '<p style="color: #dd4b39; font-size: 18px; font-weight: 400; text-align: center;">'+data.error+'</p>';
				showToast(data.error, '#e74c3c');
			}

			if(data.errorCode == 404){
				forceLogout(data.error);
			}

		}
	});	
}

function loadMoreOrders(user, nextID){
	
	var data = {
		"token": window.localStorage.loggedInAdmin,
		"id": nextID*5,
		"key": user
	}

	$.ajax({
		type: 'POST',
		url: 'https://www.zaitoon.online/services/possearchrewards.php',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(data) {
			if(data.status){
				console.log(data)
				appendToHistory(data, nextID, user)

			}

			if(data.errorCode == 404){
				forceLogout(data.error);
			}

		}
	});		
}


function renderHistory(data, userID){

	var redeemButton = '<button class="btn btn-success rewardsButton">Redeem Points</button>';
	if(data.points < 50){
		redeemButton = '<button class="btn btn-success rewardsButton" disabled>Redeem Points</button>'+
		'<p style="color: #7f8c8d; margin-top: 5px; text-align: center"><i class="fa fa-warning"></i> Minimum 50 active points required to Redeem</p>';
	}

document.getElementById("renderAreaUserInfo").innerHTML = '<div class="box box-primary">'+
                    '<div class="box-body" style="padding: 30px 10px 30px 10px; text-align: center">'+
                        '<img src="data/photos/users/default_customer.png">'+
                        '<h1 style="font-size: 24px; font-weight: 400">'+data.response.name+'</h1>'+
                        '<p style="margin: 0; color: #3498db">'+data.response.mobile+'</p>'+
                        '<p style="margin: 0; color: #7f8c8d">'+data.response.email+'</p>'+   
                    '</div>'+
                '</div>'+redeemButton



	var tableList = '';
	var i = 0;
	while(data.list[i]){

		var itemsList = ''
		var n = 0;
		while(data.list[i].cart.items[n]){
			itemsList = itemsList + data.list[i].cart.items[n].itemName + '('+data.list[i].cart.items[n].qty+'). ';
			n++;
		}

		tableList = tableList +     '<tr>'+
	                                    '<td>'+(i+1)+'</td>'+
	                                    '<td>'+data.list[i].date+'</td>'+
	                                    '<td>'+itemsList+'</td>'+
	                                    '<td><i class="fa fa-inr"></i> '+data.list[i].cart.cartTotal+'</td>'+
	                                    '<td>'+data.list[i].cart.cartPoints+'</td>'+
	                                '</tr>';
	    i++;                            
	}


document.getElementById("renderAreaUserStats").innerHTML = '<div>'+
				'<div class="row">'+
					'<div class="col-xs-4">'+
                        '<div class="box box-primary">'+
                            '<div class="box-body">'+
                                '<div class="rewardsCount">'+data.count+'</div>'+
                                '<div class="rewardsName">VISITS</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-xs-4">'+
                        '<div class="box box-primary">'+
                            '<div class="box-body">'+
                                '<div class="rewardsCount">'+data.volume+'<i class="fa fa-inr rewardsRs"></i></div>'+
                                '<div class="rewardsName">TOTAL SPENT</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-xs-4">'+
                        '<div class="box box-primary">'+
                            '<div class="box-body">'+
                                '<div class="rewardsCount">'+data.points+'</div>'+
                                '<div class="rewardsName">ACTIVE POINTS</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+ 
                '</div>'+ 
                '<div class="box box-primary">'+
                    '<div class="box-body">'+
                        '<div class="box-header" style="padding: 10px 0px">'+
                           '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Recent Visits</h3>'+
                        '</div>'+
                        '<div class="table-responsive">'+
                            '<table class="table" style="margin: 0">'+
                            	'<col width="5%"><col width="15%"><col width="50%"><col width="15%"><col width="15%">'+
                                '<thead style="background: #f4f4f4;">'+
                                    '<tr>'+
                                        '<th style="text-align: left">#</th>'+
                                        '<th style="text-align: left">Date</th>'+
                                        '<th style="text-align: left">Summary</th>'+
                                        '<th style="text-align: left">Amount</th>'+
                                        '<th style="text-align: left">Points</th>'+
                                    '</tr>'+
                                '</thead>'+
                            '</table>'+
                            '<div style="height: 40vh !important; overflow: scroll">'+
                            '<table class="table" style="margin: 0">'+
                            	'<col width="5%"><col width="15%"><col width="50%"><col width="15%"><col width="15%">'+
                                '<tbody id="allHistoryOrders">'+tableList+'</tbody>'+
                            '</table>'+
                            '</div>'+
                            '<div id="buttonArea"><button class="btn btn-default" id="loadMoreButton" onclick="loadMoreOrders(\''+userID+'\', 1)" style="display: none">Load More</button></div>'+
                        '</div>'+
                        '<div class="clearfix"></div>'+
                    '</div>'+
                '</div>'

	/*If to display the LOAD MORE button*/
	if(data.list.length%5 == 0){
		document.getElementById("loadMoreButton").style.display = 'block';
	}

}


function appendToHistory(data, currentKey, user){

	var tableList = '';
	var i = 0;
	while(data.list[i]){

		var itemsList = ''
		var n = 0;
		while(data.list[i].cart.items[n]){
			itemsList = itemsList + data.list[i].cart.items[n].itemName + '('+data.list[i].cart.items[n].qty+'). ';
			n++;
		}

		tableList = tableList +     '<tr>'+
	                                    '<td>'+((currentKey*5)+i+1)+'</td>'+
	                                    '<td>'+data.list[i].date+'</td>'+
	                                    '<td>'+itemsList+'</td>'+
	                                    '<td><i class="fa fa-inr"></i> '+data.list[i].cart.cartTotal+'</td>'+
	                                    '<td>'+data.list[i].cart.cartPoints+'</td>'+
	                                '</tr>';
	    i++;                            
	}


	document.getElementById("allHistoryOrders").innerHTML = document.getElementById("allHistoryOrders").innerHTML + tableList;
	document.getElementById("buttonArea").innerHTML = '<button class="btn btn-default" id="loadMoreButton" onclick="loadMoreOrders(\''+user+'\', '+(currentKey+1)+')" style="display: none">Load More</button>';

	/*If to display the LOAD MORE button*/
	if(data.list.length%5 == 0){
		document.getElementById("loadMoreButton").style.display = 'block';
	}
}