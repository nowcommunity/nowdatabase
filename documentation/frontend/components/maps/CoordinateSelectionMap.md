# CoordinateSelectionMap

The [CoordinateSelectionMap](../../../../frontend/src/components/Map/CoordinateSelectionMap.tsx) is used in the [LocalityTab](../../../../frontend/src/components/Locality/Tabs/LocalityTab.tsx) of localities when editing. It is opened by clicking the Get coordinates button.

The map has a draggable marker for selecting coordinates, and a search box for searching for a location. The search uses the GeoNames free API. The API call is handled by the server on the backend, see [geonamesReducer](../../../../frontend/src/redux/geonamesReducer.ts) and the [geonames-api](../../../../backend/src/routes/geonames-api.ts) route. The API-key for GeoNames is a simple username. To use the search during development, create a free account on [geonames.org](https://www.geonames.org/) and set GEONAMES_USERNAME in the appropriate .env file. Note that you also need to enable the use of the webservice for your account here: https://www.geonames.org/manageaccount.

### Note

- The default coordinates are in Kumpula, not in the location already in the locality you're editing

### Possible later features/to-dos

- while editing, make marker's default position match the current coordinates

- make modal window smaller / more fit with the map

- show which country the marker is on

  - insert this to the form when saved in edit mode
