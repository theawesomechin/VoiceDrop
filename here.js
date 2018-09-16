/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: "z3DwXPl9LySEahReDn2s",
  app_code: "EHOYR2kP_aVMpKW4HFt57Q",
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById("map"), defaultLayers.normal.map, {
  pixelRatio: pixelRatio
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

//Current location (HARDCODED)
// var longitude = 25.75;
// var latitude = -80.37;
// var userName = "Richard Dang";
// var currentArea = null;
// var voiceClip = null;

var currentLocation = {
  longitude: 25.75,
  latitude: -80.37,
  userName: "Richard Dang Current",
  currentArea: null,
  voiceClip: null
};

var marker1 = {
  longitude: 25.77,
  latitude: -80.37,
  userName: "Richard Dang1",
  currentArea: null,
  voiceClip: null
};
var marker2 = {
  longitude: 25.751,
  latitude: -80.37,
  userName: "Richard Dang2",
  currentArea: null,
  voiceClip: null
};
var marker3 = {
  longitude: 25.77,
  latitude: -80.41,
  userName: "Richard Dang3",
  currentArea: null,
  voiceClip: null
};

var markers = [currentLocation, marker1, marker2, marker3];

//Set polling interval
//setInterval(function() {
  moveMapToLocation(map, currentLocation.longitude, currentLocation.latitude);
//}, 3000);

//Call after user records their message and adds a message
//Data should be obtained from db

for (i in markers) {
  addInfoBubble(map, markers[i]);
}


/**
 * Moves the map to display over current location
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToLocation(map, latitude, longitude) {
  map.setCenter({ lat: latitude, lng: longitude });
  map.setZoom(16);
}

/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addMarkerToGroup(group, coordinate, html) {
  var marker = new H.map.Marker(coordinate);
  // add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}

/**
 * Add a marker showing the current position.
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addInfoBubble(map, marker) {
  var group = new H.map.Group();

  map.addObject(group);

  // add 'tap' event listener, that opens info bubble, to the group
  group.addEventListener(
    "tap",
    function(evt) {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
        // read custom data
        content: evt.target.getData()
      });
      // show info bubble
      ui.addBubble(bubble);
    },
    false
  );

  //TODO: Refactor out
  reverseGeocode(group, marker);
}

function getVoiceClip(distance) {
  //hardcoded to distance now
  return "Voice Clip Holder";
}

/*
 * @param   {H.service.Platform} platform
 */
function reverseGeocode(group, marker) {
  var geocoder = platform.getGeocodingService(),
    parameters = {
      prox: `${marker.longitude},${marker.latitude}`,
      mode: "retrieveAreas",
      gen: "9"
    };

  geocoder.reverseGeocode(
    parameters,
    function(result) {
      marker.currentArea =
        result["Response"]["View"][0]["Result"][0]["Location"]["Address"][
          "Label"
        ];

      var distance = this.distance(currentLocation.latitude, currentLocation.longitude,
         marker.latitude, marker.longitude).toFixed(2);

      marker.voiceClip = distance < 0.5 ? getVoiceClip() : "";

      addMarkerToGroup(group, { lat: marker.longitude, lng: marker.latitude }, `<div>${marker.userName}</div>
            <div>Distance: ${distance}</div>
            <div>Listen: ${marker.voiceClip}</div>

            <div>${marker.currentArea}</div>
            <div >Longitude:${marker.longitude} Latitude:${marker.latitude}</div>`);
    },
    function(error) {
      alert(error);
    }
  );
}

//Refactor into new file
function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1 / 180
  var radlat2 = Math.PI * lat2 / 180
  var theta = lon1 - lon2
  var radtheta = Math.PI * theta / 180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist)
  dist = dist * 180 / Math.PI
  dist = dist * 60 * 1.1515
  if (unit == "K") { dist = dist * 1.609344 }
  if (unit == "N") { dist = dist * 0.8684 }
  return dist
}