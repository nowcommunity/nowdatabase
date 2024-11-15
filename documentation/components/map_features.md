# Map features

The app has two map features made with OpenStreetMap and React-Leaflet

## Functionality for now

- there is a page for a map
- eventually this page will let you see filtered localities as markers on the map, and view their details

- a map is also implemented for coordinate selection when creating or editing a locality
- you can drag a marker with mouse
  - you can see the current lat/lng decimal coordinates of the marker under the Map
- press "Save" button to transfer the coordinates to the form

### Note

- The default coordinates are in Kumpula, not in the location already in the locality you're editing

### Possible later features/to-dos

- while editing, make marker's default position match the current coordinates

- make modal window smaller / more fit with the map

- show which country the marker is on

  - insert this to the form when saved in edit mode

- add search bar to Map (by cities or something)
  - make marker move when a city is chosen
  - make map move closer to the city when a city is chosen?

### Dev notes

- OSM Tile Usage Policy!

  > for production: Tile Usage Policy https://operations.osmfoundation.org/policies/tiles/ of OpenStreetMap if you’re going to use the tiles in production.

  > OpenStreetMap data is free for everyone to use. Our tile servers are not.
  > Because OpenStreetMap data is free, many other organisations provide map tiles made from OSM data. If your project doesn’t meet our requirements, you can get OSM-derived map tiles elsewhere.

- I don't know what server-side rendering is but you can't do that while using react-leaflet

  > Leaflet makes direct calls to the DOM when it is loaded, therefore React Leaflet is not compatible with server-side rendering.

- Make sure the map container has a defined height, for example by setting it in CSS: #map { height: 180px; }

### In the PHP test/current version (aka: not this project, but how Map works in the previous one)

Locality -> New -> get coordinates -button
-> popup

Clicking on map => shows Lat + Long

- Latitude: 60.722200435142156, Longitude: 26.3671875

- includes also "search location", where...

  - "nuuksio" : 1 result
  - "new york : 1 result
  - "new" : no results
  - "york" : 2 results from UK
  - "Moscow" : 1 result (apparently there are more cities named moscow, so hmm)

  - result list's items look like "Helsinki, Finland"
    - clicking result text doesn't change shown Lat/Lon
    - but it shows a marker on the map
      - clicking the marker changes Lat/Lon
