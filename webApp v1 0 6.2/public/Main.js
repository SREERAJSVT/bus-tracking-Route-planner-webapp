const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector("#content-sign-in");
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector("#authentication-bar");
//const contentmapElement=document.querySelector('#mapdivision')
// Elements for sensor readings
const latElement = document.getElementById("latvalue");
const lngElement = document.getElementById("lngvalue");
const speedElement = document.getElementById("speedvalue");
const sosElement = document.getElementById("sosvalue");
window.onload = function()
{
}
// MANAGE LOGIN/LOGOUT UI
const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loginElement.style.display = 'none';
    contentElement.style.display = 'block';
    authBarElement.style.display ='block';
    userDetailsElement.style.display ='block';
    userDetailsElement.innerHTML = user.email;
    //contentmapElement.style.display ='none'
    // get user UID to get data from database
    var uid = user.uid;
    console.log(uid);
  
    // Database paths (with user UID)
    var dbPathLat = 'UsersData/'+ uid.toString()+'/lat';
    var dbPathLng = 'UsersData/'+ uid.toString()+'/lng';
    var dbPathSpeed = 'UsersData/'+ uid.toString()+'/speed';
    var dbPathSos = 'UsersData/'+ uid.toString()+'/sos';
    // Database references
    var dbRefLat = firebase.database().ref().child(dbPathLat);
    var dbRefLng = firebase.database().ref().child(dbPathLng);
    var dbRefSpeed = firebase.database().ref().child(dbPathSpeed);
    var dbRefSos = firebase.database().ref().child(dbPathSos);
    // Update page with new readings


    dbRefLat.on('value', snap => {
      latElement.innerText = snap.val().toFixed(7);
    });

    dbRefLng.on('value', snap => {
      lngElement.innerText = snap.val().toFixed(7);
    });

    dbRefSpeed.on('value', snap => {
      speedElement.innerText = snap.val().toFixed(0);
    });
    dbRefSos.on('value', snap => {
        sosElement.innerText = snap.val().toFixed(0);
      });
  
/*This code assumes that the location data in Firebase Realtime Database is stored under the "location" node and the latitude is stored under the "latitude" key,
 while the longitude is stored under the "longitude" key. You can modify this code to match your specific Firebase Realtime Database structure.

*/ var dbPathLat = 'UsersData/' + uid.toString() + '/lat';
var dbPathLng = 'UsersData/' + uid.toString() + '/lng';

var lat, lng;

firebase.database().ref(dbPathLat).once('value', function(snapshot) {
  lat = snapshot.val();
  firebase.database().ref(dbPathLng).once('value', function(snapshot) {
    lng = snapshot.val();
    const googleMapsURL = 'https://maps.google.com/?q=' + lat + ',' + lng;
    const mapdirectlink = document.querySelector('#mapdirectlink');
    mapdirectlink.innerHTML = `<div class='mapDirctlink'><a id='maplink' href='${googleMapsURL}'>Click here to view location</a></div>`;
  });
});

      function showTime()
      {
      //document.getElementById('currentTime').innerHTML = now.toString();
      //document.getElementById('currentTime').innerHTML = new Date()
      document.getElementById('currentTime').innerHTML = now.toUTCString();
      var now = new Date();
      now.setHours(now.getHours() + 5);
      now.setMinutes(now.getMinutes() + 30);
      setInterval(function()
      {
      showTime();
      },1000);
      
    }


  // if user is logged out
  } else{
    // toggle UI elements
    loginElement.style.display = 'block';
    authBarElement.style.display ='none';
    userDetailsElement.style.display ='none';
    contentElement.style.display = 'none';
    contentmapElement.style.display ='none';
  }
}



//set map options
var myLatLng = { lat: 8.94978, lng: 76.98201 };
var mapOptions = {
    center: myLatLng,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};

//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

//define calcRoute function
//define calcRoute function
function calcRoute() 
{
//create request
var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.IMPERIAL
}

//pass the request to the route method
directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {

        //Get distance and time
        const output = document.querySelector('#output');
        output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

        //display route
        directionsDisplay.setDirections(result);
    } else {
        //delete route from map
        directionsDisplay.setDirections({ routes: [] });
        //center map in London
        map.setCenter(myLatLng);

        //show error message
        output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
    }
});


}



//create autocomplete objects for all inputs
var options = {
types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);

