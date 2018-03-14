function renderOnlineOrders($http){
	var xmlhttp = new XMLHttpRequest();
	var url = "http://jafry.in/fetchorders.php";

	var lastOrderFetchData = window.localStorage.lastOrderFetchData ?  JSON.parse(window.localStorage.lastOrderFetchData) : [];

	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var myArr = JSON.parse(this.responseText);
	        //console.log(myArr);
	        var i =0;
	        var items = "";
	        var incomingOrdersCount = myArr.length;
	        while(i<myArr.length){
	        	items = items + '<tr role="row" onclick="OrderWiseItemList(\''+myArr[i].orderID+'\')"> <td>'+myArr[i].orderID+'</td> <td>'+myArr[i].userName+'<br>'+myArr[i].userID+'</td> <td><i class="fa fa-inr"></i> '+myArr[i].amountPaid+'</td> <td>'+myArr[i].timePlace+' pm</td> </tr>';
	        	i++;
	        }
	        //console.log(myArr)
	        window.localStorage.lastOrderFetchData = JSON.stringify(myArr);
	        document.getElementById("onlineOrders").innerHTML = items;
	        document.getElementById("incomingOrdersCount").innerHTML = incomingOrdersCount;
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function OrderWiseItemList(orderID){
	//console.log(orderID);
	var lastOrderFetchData = window.localStorage.lastOrderFetchData ?  JSON.parse(window.localStorage.lastOrderFetchData) : [];
	var i = 0;
	while(i<lastOrderFetchData.length){
		if(lastOrderFetchData[i].orderID==orderID){
			var ordertype = lastOrderFetchData[i].isPrepaid ? "PREPAID ORDER" : "Cash on Delivery";
			document.getElementById("orderInfo").innerHTML = '<h3 class="box-title" style="padding: 5px 0px; font-size: 21px;">Order #'+orderID+' <tag class="onlinePrepaid">'+ordertype+'</tag> </h3> <button class="btn btn-success btn-sm" style="float: right">Punch KOT</button>';
			var j = 0;
			var item = "";
			while(j<lastOrderFetchData[i].cart.length){
				item = item + '<tr> <td>'+(j+1)+'</td> <td>'+lastOrderFetchData[i].cart[j].name+'</td> <td>'+lastOrderFetchData[i].cart[j].qty+'</td> <td><i class="fa fa-inr"></i> '+lastOrderFetchData[i].cart[j].price+'</td> <td><i class="fa fa-inr"></i> '+lastOrderFetchData[i].cart[j].qty*lastOrderFetchData[i].cart[j].price+'</td> </tr>'; 
				j++;
			}
			item = item + '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Sub Total</b></td> <td></td> <td><i class="fa fa-inr"></i> '+lastOrderFetchData[i].amountPaid+'</td> </tr>';
			item = item +'<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Total Extras</b></td> <td></td> <td><i class="fa fa-inr"></i> 0</td> </tr>';
			item = item +'<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Total Discounts</b></td> <td></td> <td><i class="fa fa-inr"></i> 0</td> </tr>';
			item = item + '<tr style="background: #fcfcfc"> <td></td> <td></td> <td><b>Total Amount Received</b></td> <td></td> <td><i class="fa fa-inr"></i> '+lastOrderFetchData[i].amountPaid+'</td> </tr>';
			document.getElementById("itemInfo").innerHTML = item;
			document.getElementById("addressInfo").innerHTML = '<div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">Delivery Address</p> <p class="deliveryText">'+lastOrderFetchData[i].deliveryAddress+'</p> <p class="deliveryText">Mob. <b>'+lastOrderFetchData[i].userID+'</b></p> </div> </div> <div class="col-xs-2"> </div> <div class="col-xs-5"> <div class="deliveryAddress"> <p class="deliveryTitle">COMMENTS TO CHEF</p> <p class="deliveryComment">'+lastOrderFetchData[i].comments+'</p> </div> </div>';
			break;
		}
		i++;
	}

}