auth.onAuthStateChanged(user => {
    if (user) {
      console.log("user logged in");
      console.log(user);
      var uid = user.uid;
      console.log(uid);
    } else {
      console.log("user logged out");
    }
   });

var mapOptions;

function initMap() {
  var myLatLng = {
    lat: 8.94978,
    lng: 76.98201
  };

  mapOptions = {
    zoom: 12,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var dbPathLat = 'UsersData/' + 'iRB6Vl3rZnQt8G1w5nQebysB20c2' + '/lat';
  var dbPathLng = 'UsersData/' + 'iRB6Vl3rZnQt8G1w5nQebysB20c2' + '/lng';
  var lat, lng;
  firebase.database().ref(dbPathLat).once('value', function (snapshot) {
    latFromFirebase = snapshot.val();
    firebase.database().ref(dbPathLng).once('value', function (snapshot) {
      lngFromFirebase = snapshot.val();
      const googleMapsURL = 'https://maps.google.com/?q=' + latFromFirebase + ',' + lngFromFirebase;
      const mapdirectlink = document.querySelector('#mapdirectlink');


      mapdirectlink.innerHTML = `<div class='mapDirctlink'><a id='maplink' href='${googleMapsURL}'>Click here to view location</a></div>`;

      myLatLng = {
        lat: latFromFirebase,
        lng: lngFromFirebase
      };
      
      new google.maps.Marker({
        position: myLatLng,
        map,
        title: "busb80 heare ",
      });
    });
  });
}

window.initMap = initMap;
