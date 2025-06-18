# Map features

See component-specific docs at [CoordinateSelectionMap](./CoordinateSelectionMap.md) and [LocalitiesMap](./LocalitiesMap.md)

The map features use the React Leaflet package and OpenStreetMap.

### Dev notes

- OSM Tile Usage Policy!

  > for production: Tile Usage Policy https://operations.osmfoundation.org/policies/tiles/ of OpenStreetMap if you’re going to use the tiles in production.

  > OpenStreetMap data is free for everyone to use. Our tile servers are not.
  > Because OpenStreetMap data is free, many other organisations provide map tiles made from OSM data. If your project doesn’t meet our requirements, you can get OSM-derived map tiles elsewhere.

- Make sure the map container has a defined height, for example by setting it in CSS: #map { height: 180px; }
