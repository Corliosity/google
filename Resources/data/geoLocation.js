/**
 * @author Andrew Corliss
 */
function geoLocation()
{	
	//Note this geoLocation is only good for iOS please search the Titanium API/Q+A section for tips on using Android geoLocate
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	
	Ti.Geolocation.purpose = 'We will be using your location to help locate services nearest you';
	Ti.Geolocation.preferredProvider = 'gps';
	
	if (Ti.Geolocation.locationServicesEnabled == false)
	{
		alert('Please help us locate services nearest you');
	};
	var authorized = Titanium.Geolocation.locationServicesAuthorization;
	if (authorized == Titanium.Geolocation.AUTHORIZATION_DENIED){
		Ti.UI.createAlertDialog
		({
			title: 'Job Hunter Extreme',
			message: 'You have denied access to geolocation services'
		}).show();
		
	};
	
	//Set our distance filter in meters
	Titanium.Geolocation.distanceFilter = 100;
	
	//One time location cal;

		
	Titanium.Geolocation.getCurrentPosition(function(e)
	{
		//fire event with the information
		//Ti.API.info('firing event');
		Ti.App.fireEvent('location.update',e);
	});
	
	Ti.App.addEventListener('location.update',function(d){
		//Ti.API.info('here I am');
	});
	
}
module.exports = geoLocation;