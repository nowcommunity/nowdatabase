# Map thoughts and stuff I'm writing, very incomplete bilingual documentation + thoughts

# Functionality for now

- there is a page for a map
- you can toggle drag of the marker by first clicking it and then clicking the pop-up text
- when the marker is draggable, you can double-click it to grab it
  - then while holding the mouse button, you can move the marker around
  - now you can see the lat/lng on the Map Page

### Thinking:
- OSM:n Tile Usage Policy.
- en tiedä mitä server-side rendering on, mut react-leaflet ei sovi sen kaa yhteen
- Make sure the map container has a defined height, for example by setting it in CSS: #map { height: 180px; }

OpenStreetMap tiles are fine for programming your Leaflet map, but read the Tile Usage Policy https://operations.osmfoundation.org/policies/tiles/ of OpenStreetMap if you’re going to use the tiles in production.

> OpenStreetMap data is free for everyone to use. Our tile servers are not.
> Because OpenStreetMap data is free, many other organisations provide map tiles made from OSM data. If your project doesn’t meet our requirements, you can get OSM-derived map tiles elsewhere.

Leaflet makes direct calls to the DOM when it is loaded, therefore React Leaflet is not compatible with server-side rendering.
     https://medium.com/@timndichu/getting-started-with-leaflet-js-and-react-rendering-a-simple-map-ef9ee0498202


### TODO
 TODO:
  - show lat/lon DONE

  - do things in Locality
    - add button to locality
    - open map in locality by pressing the button
      - a small popup?
    - add a way to click/drag a location
    - some confirmation or show info or "is this ok?", maybe?
    - add input from map to fields

  
### maybe later
  - show country based on lat/lon?
  - make the draggable marker always draggable
  
  - add search bar to Map (by cities or something)
    - make draggable marker move when a city is chosen
    - make map move closer to the city when a city is chosen

### NOW_DATABASE test/current versiossa

Locality -> New -> get coordinates -button

-> popup.

Clicking on map => shows Lat + Long
  - esim Latitude: 60.722200435142156, Longitude: 26.3671875

- sisältää myös "search location"
    - jossa nuuksio tuo 1 tulos
    - new york tuo 1 tulos
    - new ei tuo mitään
    - york tuo 2, both same from UK?
    - Moscow ja joku muu jota pitäis olla useampi kaupunki, nii löyty vaan 1?

  - tuloslista on tyyliä "Helsinki, Finland"
    - tuloksen klikkaaminen ei muuta näkyvää Lat/Lon
    - tulee marker kartalle
        - sen klikkaaminen muuttaa Lat/Lon
  

### NOW_DATABASE dev versiossa
- ?

