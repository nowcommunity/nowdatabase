# Localities map

See [LocalitiesMap](../../../../frontend/src/components/Map/LocalitiesMap.tsx).


A map component that takes in an array of `Locality` objects, along with an 'is loading' boolean value.
The component will display each of these localities as a marker, that the user is able to click in order to view details related to that locality (locality details, fossils associated with that locality).

The component uses the [`leaflet.js`](../../../../frontend/src/components/Map/leaflet.js) plain JavaScript library (not `react-leaflet` like in the [CoordinateSelectionMap](CoordinateSelectionMap.md) component).
This is in order to make certain features simpler to implement as we are not limited by the features that `react-leaflet` wraps.

Whenever the component is rendered, it will load the map but remain hidden to the user.
The user can reveal the map using the 'Open map' button included with the component.

By default locality markers are clustered using the [`leaflet.markercluster.js`](../../../../frontend/src/components/Map/leaflet.markercluster.js) library.
It is a plain JavaScript library as well, designed to extend the namespace `L` when loaded.
It doesn't have exported members nor does it play nicely with the surrounding modular TypeScript environment, so there is some lint and tsc ignores in the file.
Better solutions to this are welcomed.

On the edges of the map the user can see a scale display as well as a north arrow.
In the top right corner, there is a layer selection menu in which the user can select which map view should be visible.
By default, the component shows a topological map.
A normal street map as well as a simplified map with only country borders visible are available.


## Country border view

The simplified country border map view is achieved through a hardcoded array of latitude-longitude polygons that represent country borders, imported from [`country_borders_WGS84.ts`](../../../../frontend/src/components/Map/country_borders_WGS84.ts).
This means that the country borders are fixed in time to the moment of when that file was last updated.
Detailed instructions on where to get the data and how to convert it to this desired format can be found at (TBD).


