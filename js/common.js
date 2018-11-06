/*
  SERVER DETAILS
*/

var default_server_url_common = 'http://admin:admin@127.0.0.1:5984/';
var saved_server_url_manual = window.localStorage.serverConnectionURL ? window.localStorage.serverConnectionURL : '';

let COMMON_LOCAL_SERVER_IP = saved_server_url_manual != '' ? saved_server_url_manual : default_server_url_common;
let NOTIFICATION_FILTER = 'ALL';


//To format the time in '' ago format
function getFormattedTime(time){
    var tempTime = moment(time, 'hhmm').fromNow(true);
    tempTime = tempTime.replace("seconds", "s");
    tempTime = tempTime.replace("a few s", "seconds");
    tempTime = tempTime.replace("a minute", "1m");
    tempTime = tempTime.replace(" minutes", "m");
    tempTime = tempTime.replace("an hour", "1h");
    tempTime = tempTime.replace(" hours", "h");
    return tempTime;
}

function getFancyTime(time){
  var fancy = moment(time, 'hhmm').format('hh:mm A');
  return fancy == 'Invalid date' ? '--:--' : fancy;
}


function getSummaryStandardDate(date){
  //convert YYYY-MM-DD to YYYY-MM-DD
  return moment(date, 'DD-MM-YYYY').format('YYYYMMDD')
}

function getHumanStandardDate(date){
  //convert YYYY-MM-DD to YYYY-MM-DD
  return moment(date, 'YYYYMMDD').format('DD-MM-YYYY')
}

function getSuperFancyDate(date){
  //convert DD-MM-YYYY to DD MM, YYYY
  return moment(date, 'DD-MM-YYYY').format('Do MMMM, YYYY')
}

//Returns today, and current time
function getCurrentTime(type){
          
          var today = new Date();
          var time;
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          var hour = today.getHours();
          var mins = today.getMinutes();

          if(dd<10) {
              dd = '0'+dd;
          } 

          if(mm<10) {
              mm = '0'+mm;
          } 

          if(hour<10) {
              hour = '0'+hour;
          } 

          if(mins<10) {
              mins = '0'+mins;
          }

          today = dd + '-' + mm + '-' + yyyy;
          time = hour + '' + mins;


    if(type == 'TIME'){
    	return time;
    }

    if(type == 'DATE')
    	return today;

    if(type == 'DATE_DDMMYY')
      return dd+''+mm+''+yyyy;

    if(type == 'DATE_DD-MM-YY')
      return dd+'-'+mm+'-'+yyyy;

    if(type == 'DATE_YYYY-MM-DD')
      return yyyy+'-'+mm+'-'+dd;

    if(type == 'DATE_STAMP')
      return yyyy+''+mm+''+dd;
	 
}

function random_rgba_color_set() {

    var o = Math.round;
    var r = Math.random;
    var s = 255;

    var color = o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s);

    return ['rgba('+color+', 0.2)', 'rgba('+color+', 1)'];
}


//Returns first letters of the 2 words in the string
function getImageCode(text){
	text = text.replace(/[^a-zA-Z ]/g, "");
  text = text.toUpperCase();
	var words = text.split(' ');

	if(words.length > 1){
		return words[0].substring(0,1)+words[1].substring(0,1);
	}
	else{
		return (text.substring(0, 2)).toUpperCase();
	}
}



/*Toast*/
var toastShowingInterval;
function showToast(message, color){

  switch(NOTIFICATION_FILTER){

    case "ALL":{
      clearInterval(toastShowingInterval);

      var x = document.getElementById("infobar")
      if(color){
        x.style.background = color;
      }

      x.innerHTML = message;
      x.className = "show";
      toastShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000); 

      if(color == '#e74c3c'){ //Error
        playNotificationSound('ERROR')
      }

      break;
    }
    case "WARNINGS":{

      if(color == '#e74c3c' || color == '#e67e22'){
          clearInterval(toastShowingInterval);

          var x = document.getElementById("infobar")
          if(color){
            x.style.background = color;
          }

          x.innerHTML = message;
          x.className = "show";
          toastShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000); 

          if(color == '#e74c3c'){ //Error
            playNotificationSound('ERROR')
          }
      }

      break;
    }
    case "ERRORS":{

      if(color == '#e74c3c'){
          clearInterval(toastShowingInterval);

          var x = document.getElementById("infobar")
          if(color){
            x.style.background = color;
          }

          x.innerHTML = message;
          x.className = "show";
          toastShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000); 

          if(color == '#e74c3c'){ //Error
            playNotificationSound('ERROR')
          }
      }

      break;
    }
    case "NONE":{
      //Do not show anything!
      break;
    }

  }

}


/*Undo Toast*/
var undoShowingInterval;
function showUndo(message, undoFunction){

    clearInterval(undoShowingInterval);

    var x = document.getElementById("undoBar")

    document.getElementById("undoBarText").innerHTML = message;
    document.getElementById("undoBarButton").innerHTML = '<button id="undoBarButtonAction" onclick="'+undoFunction+'" class="btn btn-default clearUndoButton">UNDO</button>';

    x.className = "show";
    undoShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000); 


    $("#undoBarButtonAction").click(function(){
      clearInterval(undoShowingInterval);
      x.className = x.className.replace("show", "");
    });

}



/* USAGE:
  showUndo('Message', 'alert(\'OK\')')
*/

/* Loading */
var loadingLapsedInterval;
function showLoading(time, text){

  document.getElementById("generalLoadingModal").style.display = 'block';

  if(!text && text == ''){
    document.getElementById("generalLoaderText").innerHTML = 'Loading...';
  }
  else{
    document.getElementById("generalLoaderText").innerHTML = text;
  }
  

  var startCount = 10;
  if(time && time != ''){
    startCount = parseInt(time)/1000;
  }

  document.getElementById("generalLoaderCount").innerHTML = startCount;

  loadingLapsedInterval = window.setInterval(function() {
    if(startCount == 1){
      clearInterval(loadingLapsedInterval);
      document.getElementById("generalLoadingModal").style.display = 'none';
    }

    startCount--;
    document.getElementById("generalLoaderCount").innerHTML = startCount;
    console.log('Am Secretly running...')
  }, 1000); 

}

function hideLoading(){
  clearInterval(loadingLapsedInterval);
  document.getElementById("generalLoadingModal").style.display = 'none';
  document.getElementById("generalLoaderCount").innerHTML = '';
  document.getElementById("generalLoaderText").innerHTML = 'Loading...';
}


function getTablesSorted(unsorted_list){
  Object.keys(unsorted_list)
      .sort()
      .forEach(function(v, i) {
          console.log(v, data[v]);
       });
}


/* USAGE:
showLoading(3000, 'Custom Text');
*/






