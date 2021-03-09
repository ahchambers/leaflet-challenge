// Creating map object
var myMap = L.map("map", {
    center: [39.59,-98.35],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v9",
    accessToken: api_key
  }).addTo(myMap);
  
  // URL with Earthquake data
  var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Colour selection
  var colours = ['#aaff00', '#ffff00', '#ffcc00', '#ff9933', '#ff9900', '#ff0000'];
  
  // Earthquake magnitudes
  var categories = ['0-1','1-2','2-3','3-4','4-5', '5+'];
  
  // Function to determine colour
  function chooseColour(magnitude) {
    if (magnitude < 1) {
      return colours[0];
    } else if (magnitude >=1 && magnitude < 2) {
      return colours[1];
    } else if (magnitude >= 2 && magnitude < 3) {
      return colours[2];
    } else if (magnitude >=3 && magnitude < 4) {
      return colours[3];
    } else if (magnitude >=4 && magnitude < 5) {
      return colours[4];
    } else if (magnitude >= 5) {
      return colours[5];
    }
  }
  
  // Marker size
  var markerSize = (magnitude) => {
      return magnitude * 4;
    }
  
  var geojsonMarkerOptions = {
      radius: 15,
      weight: 2,
      opacity: 1,
  };
  
  // Query data with d3
  d3.json(queryURL, (data) => {
  
      // Create geojson layer
      L.geoJson(data, {
          pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, geojsonMarkerOptions);
          },
          // Set the style
          style: (feature) => {
              return {
                  color: "grey",
                  fillColor: chooseColour(feature.properties.mag),
                  fillOpacity: 0.4,
                  weight: 1.0,
                  radius: markerSize(feature.properties.mag)
              };
          },
  
          // Call function
          onEachFeature: (feature, layer) => {
  
              layer.on({
                  // Mouse over event
                  mouseover: (event) => {
                      layer = event.target;
                      layer.setStyle({
                          fillOpacity: 0.9
                      });
                  },
                  // Mouse out event
                  mouseout: (event) => {
                      layer = event.target;
                      layer.setStyle({
                          fillOpacity: 0.4
                      });
                  },
              });
  
              layer.bindPopup(
                  `<h4>${feature.properties.place}</h4><hr>
                  <p>Magnitude: ${feature.properties.mag}</p>`
              );
          }
      }).addTo(myMap);
  
      // Create legend
      var legend = L.control({position: "bottomright"});
      legend.onAdd = function(myMap) {
          var div = L.DomUtil.create("div", "info legend");
          var labels = ["<strong>Magnitude</strong>"];
  
          categories.forEach((x, i) => {
            div.innterHTML += labels.push(
              `<i style="background:${colours[i]}"></i>${(categories[i] ? categories[i] : '+')}`
              );
          })
  
          div.innerHTML = labels.join("<br>");
          return div;
      };
      legend.addTo(myMap);
  });