//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	var mapview;
	
	mapview = Titanium.Map.createView
	({
		mapType: Titanium.Map.STANDARD_TYPE,
        region: {latitude:your_latitude, longitude:your_longitude, 
                latitudeDelta:0.001, longitudeDelta:0.001},
        animate:true,
        regionFit:true,
        userLocation:true,
	}); //end create mapView
	
	function populateData()
	{	
		// call our event listener from WebService to get our array from google places
		Ti.App.addEventListener('getting.places', function(d)
		{
			Ti.API.debug(d);
			
			// call the variable with data and parse
			jsonArray = JSON.parse(d.responseText);
		
			// call for loop to show all data points		
			for (var i = 0; i < jsonArray.results.length; i++)
			{
				//Ti.API.info(jsonArray.results[i]);
				mapview.addAnnotation
				(
					Ti.Map.createAnnotation
					({
						animate: false, //Can animate if true - use descrestion if you load more than 20 points it will take forever for all pins to drop!
						pincolor: Titanium.Map.ANNOTATION_GREEN,
						//image: createImage,
						title: jsonArray.results[i].name, //+ ', $' + results[i].price,
						subtitle: jsonArray.results[i].vicinity,
						latitude: jsonArray.results[i].geometry.location.lat,
						longitude: jsonArray.results[i].geometry.location.lng,
						//leftButton: jsonArray.results[i].icon,//Ti.UI.iPhone.SystemButton.INFO_LIGHT,
						myid: jsonArray.results[i].reference,
						rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE
					}) //End mapView annotation
				); //end addAnnotation
			} //End for loop
		}); //End add Event Listner
	 
	};  //End function populateData
	
	//Call function to begin adding data
	populateData();
	
	var moreButton = Ti.UI.createButton
	({
		systemButton: Ti.UI.iPhone.SystemButton.REFRESH
	});

	//If you want to retrieve your extra data points create event for your button	
	moreButton.addEventListener('click', function(){
		//new call.getData();
		
		Ti.API.info('you clicked the button');
		Ti.App.addEventListener('update.moreBars', function(d)
		{
			Ti.API.debug(d);
			//Ti.API.info("Your New Data" + d.responseText);
			
			resultArray = JSON.parse(d.responseText);
			
			for (var i = 0; i < resultArray.results.length; i++)
			{
				mapview.addAnnotation
				(
					Ti.Map.createAnnotation
					({
						animate: false,
						pincolor: Titanium.Map.ANNOTATION_PURPLE,
						//image: createImage,
						title: resultArray.results[i].name, //+ ', $' + results[i].price,
						subtitle: resultArray.results[i].vicinity,
						latitude: resultArray.results[i].geometry.location.lat,
						longitude: resultArray.results[i].geometry.location.lng,
						//leftButton: jsonArray.results[i].icon,//Ti.UI.iPhone.SystemButton.INFO_LIGHT,
						myid: resultArray.results[i].reference,
						rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE
					})
				); //end annotaion
			} //end for loop
		}) //end event listener
		
	});

	//To retrieve your detail view infomation add an event to the map view
	//Note: to retrieve detail view page you will need to create a second call
	//I find it easiest to do on the detail page since I only use a few sources of information
	mapview.addEventListener('click',function(evt)
	{
		if (evt.clicksource == 'rightButton')
			{
				//Ti.API.info("Annotation " + evt.title + ", " + evt.annotation.subtitle);
				//create call for detail view
				var LocationDetails = require('/ui/BarDetail/BarDetails');
				var employmentDetails = new LocationDetails(evt.title, evt.annotation.latitude, evt.annotation.longitude, evt.annotation.subtitle, evt.annotation.myid, win);
				win.containingTab.open(employmentDetails);
			}
	});
	
	self.add(mapview);
	return self;
}

module.exports = FirstView;
