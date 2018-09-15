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
var longitude = 25.75;
var latitude = -80.37;

//Set polling interval
setInterval(function() {
    moveMapToLocation(map, longitude, latitude)},
    3000);

//Call after user records their message and adds a message
//Data should be obtained from db
addInfoBubble(map, longitude, latitude);

//TODO: Calculate to show markers only within a distance

/**
 * Moves the map to display over current location
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function moveMapToLocation(map, latitude, longitude) {
  map.setCenter({ lat: latitude, lng: longitude });
  map.setZoom(14);
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
function addInfoBubble(map, longitude, latitude) {
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

    reverseGeocode(group, longitude, latitude);
}

/*
 * @param   {H.service.Platform} platform
 */
function reverseGeocode(group, longitude, latitude) {
  var geocoder = platform.getGeocodingService(),
    parameters = {
      prox: `${longitude},${latitude}`,
      mode: "retrieveAreas",
      gen: "9"
    };

  geocoder.reverseGeocode(
    parameters,
    function(result) {
        var currentArea = result["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
        
        addMarkerToGroup(
            group,
            { lat: longitude, lng: latitude },
            `<div>${currentArea}` +
            `</div><div >Longitude:${longitude} Latitude:${latitude}</div>`
        );
    },
    function(error) {
      alert(error);
    }
  );
}
