/**
 * @author Andrew Corliss
 */
function googleWebService()
{
	var lat;
	var lon;
	//If you want to get a users current location then add our event listener from geoLocation to get coordinates
	Ti.App.addEventListener('get.location', function(e)
	{
		lat = e.coords.latitude;
		lon = e.coords.longitude;
		
		var start_url = "https://maps.googleapis.com/maps/api/place/search/json?";
		var url_location = 'location=' + lat +',' + lon;  //input your lat and long location to specify searches in area
		var url_rank = "&rankby=distance"; //Rankby will retrieve locations fitting your search nearest current latitude and longitude points.\
		var url_type = "&keyword=";  //Can contain any Keywords for specific searches or use Types to complete broad topics i.e.ATM, Bars, Restaurant, Banks
		var url_sensor = "&sensor=false"; //Sensor can be set to true or false depending if you want to use current region data
		var url_key = "&key=XXXXXXXXXXXXXXXX"; //Input your api key from google
		
		
		var url = start_url + url_location + url_rank + url_type + url_sensor + url_key;  //Create your URL
		
		
		//Ti.API.info(url);
		
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.onload = function(e)
		{
			//Retrieve your data
			Ti.API.debug(this.responseText);
			//Use titanium build in JSON parser to retrive info!
			var json = JSON.parse(this.responseText);
			
			//Ti.API.info(json);
			//If you choose not to use a database 
			//Create fireEvent variable with the response to send to the app
			resultArray = Ti.App.fireEvent('update.moreBars',{'responseText':this.responseText});
		}
		
		xhr.onerror = function(e)
		{
			Ti.API.info('error, HTTP status = ' + this.status);
			alert(e.error);
			Ti.API.info(e.error);
		}
		
		//Open and send your url request
		xhr.open('GET', url);
			
		xhr.send();
	});
};

//But what if I want to return more than one page of data?
//Create a new prototype function that can access the next_page_token

WebService.prototype.getData = function(){
	
	var lat;
	var lon;
	

	Ti.App.addEventListener('get.location', function(e)
	{
		lat = e.coords.latitude;
		lon = e.coords.longitude;
	
	//Remember that FireEvent?
	//Use the app.addEventListener to get our previous results and get the next_page_token
	Ti.App.addEventListener('getting.places', function(d){
		Ti.API.debug(d);
		
		jsonArray = JSON.parse(d.responseText);
		
		//Ti.API.info(jsonArray.next_page_token);
		//Note the next page token is not included under response
		next_page = jsonArray.next_page_token;
		
		//From there we create our request just as we did above
		
		var start_url = "https://maps.googleapis.com/maps/api/place/search/json?";
		var url_location = 'location=' + lat +',' + lon;
		var url_rank = "&rankby=distance"; 
		var url_type = "&keyword=XXXXXXXXXXXXXXXXXXXXXX";
		var url_sensor = "&sensor=false";
		var url_key = "&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
		var page = "&pagetoken=" + next_page;
		
		var url = start_url + url_location + url_rank + url_type + url_sensor + url_key + page;
		
		
		//Ti.API.info(url);
		
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.onload = function(e)
		{
			Ti.API.debug(this.responseText);
			
			var json = JSON.parse(this.responseText);
			
			//Ti.API.info(json);
			
			resultArray = Ti.App.fireEvent('update.moreBars',{'responseText':this.responseText});
		}
		
		xhr.onerror = function(e)
		{
			Ti.API.info('error, HTTP status = ' + this.status);
			alert(e.error);
			Ti.API.info(e.error);
		}
		
		xhr.open('GET', url);
		
		
		//One small hitch in the Google Places API is you cannot request the next page immediately after the first request
		//Set a timeout that will delay our send request at least 1 sec. - may be more or less depending on your call
		setTimeout(function() {
			
			xhr.send();
			
		}, 1500);
		
	});
	});
};
module.exports = googleWebService;