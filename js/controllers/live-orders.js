function renderKOT() {

    dirname = './data/KOT'
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            showToast('System Error: Unable to load Live Orders. Please contact Accelerate Support.', '#e74c3c');
            return;
        }

        filenames.forEach(function(filename) {
            fs.readFile(dirname + '/' + filename, 'utf-8', function(err, data) {
                if (err) {
                    showToast('System Error: Unable to load a few Live Orders. Please contact Accelerate Support.', '#e74c3c');
                    return;
                } else {

                    var kot = JSON.parse(data);

                    if(kot.orderDetails.modeType == 'DINE'){
                        var i = 0;
                        var fullKOT = "";
                        var begKOT = "";
                        var itemsInCart = "";
                        var items = "";

                        begKOT = '<li> <a href="#" onclick="pushToEditKOT(\''+encodeURI(JSON.stringify(kot))+'\')"> <h2>' + kot.KOTNumber + ' <tag class="tableName">'+kot.table+'</tag></h2><div class="itemList"> <table>';
                        while (i < kot.cart.length) {
                            itemsInCart = itemsInCart + '<tr> <td class="name">' +(kot.cart[i].isCustom ? kot.cart[i].name+' ('+kot.cart[i].variant+')' : kot.cart[i].name )+ '</td> <td class="price">x ' + kot.cart[i].qty + '</td> </tr>';
                            i++;
                        }

                        items = begKOT + itemsInCart + '</table> </div>'+(i > 6?'<more class="more">More Items</more>':'')+
                                                '<tag class="bottomTag">'+
                                                '<p class="tagSteward">' +(kot.stewardName != ''? kot.stewardName   : 'Unknown Staff')+ '</p>'+
                                                '<p class="tagUpdate">'+(kot.timeKOT == ''? 'First KOT Printed '+getFormattedTime(kot.timePunch)+' ago': 'KOT Edited '+getFormattedTime(kot.timeKOT)+' ago' )+'</p>'+
                                                '</tag> </a>';

                        fullKOT = fullKOT + items + '</li>';
                        finalRender(fullKOT)
                    }
                }

            });
        });
        

    });
}

function finalRender(fullKOT) {
    document.getElementById("fullKOT").innerHTML = document.getElementById("fullKOT").innerHTML + fullKOT;
}


/*Add to edit KOT*/
function pushToEditKOT(encodedKOT){
    
    var kot = JSON.parse(decodeURI(encodedKOT));
   
    if(window.localStorage.edit_KOT_originalCopy && window.localStorage.edit_KOT_originalCopy != ''){

        var alreadyEditingKOT = JSON.parse(window.localStorage.edit_KOT_originalCopy);
        if(alreadyEditingKOT.KOTNumber == kot.KOTNumber)//if thats the same order, neglect.
        {
            renderPage('new-order', 'Editing Order');
            return '';
        }
        else{
            showToast('Warning! There is already an active order being modified. Please complete it to continue.', '#e67e22');
            return '';
        }
    }

    if(window.localStorage.zaitoon_cart && window.localStorage.zaitoon_cart != ''){
        showToast('Warning! There is a new order being punched. Please complete it to continue.', '#e67e22');
        
        document.getElementById("overWriteCurrentOrderModal").style.display = 'block';
        document.getElementById("overWriteCurrentOrderModalConsent").innerHTML = '<button type="button" class="btn btn-default" onclick="overWriteCurrentOrderModalClose()" style="float: left">Cancel and Complete the New Order</button>'+
                                                '<button type="button" class="btn btn-danger" onclick="overWriteCurrentOrder(\''+encodedKOT+'\')">Proceed to Over Write</button>';
    }    

    overWriteCurrentOrder(encodedKOT)
}

function overWriteCurrentOrderModalClose(){
    document.getElementById("overWriteCurrentOrderModal").style.display = 'none';  
}

function overWriteCurrentOrder(encodedKOT){
    var kot = JSON.parse(decodeURI(encodedKOT));

    var customerInfo = {};
    customerInfo.name = kot.customerName;
    customerInfo.mobile = kot.customerMobile;
    customerInfo.mappedAddress = kot.table;
    customerInfo.mode = kot.orderDetails.mode;
    customerInfo.modeType = kot.orderDetails.modeType;
    customerInfo.reference = kot.orderDetails.reference;

    //Pending new order will be removed off the cart.
    window.localStorage.zaitoon_cart = JSON.stringify(kot.cart);
    window.localStorage.customerData = JSON.stringify(customerInfo);
    window.localStorage.edit_KOT_originalCopy = decodeURI(encodedKOT);
    renderPage('new-order', 'Editing Order');
}

