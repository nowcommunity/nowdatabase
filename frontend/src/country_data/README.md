# Country border polygon and bounding box data update instructions


## Create GeoJSON File in QGIS

Follow the steps below to create a GeoJSON file from a layer in QGIS.

### Prerequisites
- QGIS installed on your computer (version 3.x or later recommended)
- A vector layer loaded in QGIS (e.g., shapefile, CSV with geometry, or other spatial data)

### Instructions

1. **Open your project in QGIS.**

2. **Load the layer you want to export**, if it's not already visible:
   - Use `Layer` > `Add Layer` > `Add Vector Layer…` to load spatial data.

3. **Right-click on the layer** in the **Layers Panel** and select:
   - `Export` > `Save Features As…`

4. In the **Format** dropdown, choose:
   - `GeoJSON`

5. Set the **File name**:
   - Click the `…` button next to the file name field and choose a save location.
   - Make sure the file ends with `.geojson`

6. Choose the **CRS** (Coordinate Reference System):
   - Use `EPSG:4326 - WGS 84` for GeoJSON (standard for web use).

7. Choose just geometry to export, no other attributes/fields:
   - You can choose which features or fields to export, but choose just geometry.

8. Click **OK** to export.

9. Your GeoJSON file is now saved and ready to use.

### Notes
- You can preview the GeoJSON file in QGIS or any code/text editor.
- If you're using the file for web mapping (e.g., Leaflet, Mapbox), ensure the CRS is WGS 84 (`EPSG:4326`).

---

## Country data conversion script

In this directory, there is a script for converting a country administrative boundaries `.geojson` file into data useful for this application.
When run, the script will output two files:

- `countryPolygons.ts`: An exported array of polygons representing country boundaries.
Each polygon is an array, inside which each coordinate is an array of two numbers.
The array is of type `number[][][]`.
- `countryBoundingBoxes.ts`: An object of the following type:
```ts
{ 
    [key: string] : {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }
};
```

Where `key` is the country name and each member is an edge of the country's bounding box. 
`top` and `bottom` are longitudes while `left` and `right` are latitudes.

### Usage

The script can be run with `node` and accepts a single command line argument, the country border `.geojson` filepath.
For example to convert the already included `.geojson` in this directory one would run:

```
$ node countryExport.js world-administrative-boundaries.geojson
```

Which will either quietly create the aforementioned files in this directory or crash with an error.

#### Country name mappings

Sometimes country names between the country name list in the validators folder and the U.N. data differ.
For this purpose, at the top of the script there is a mapping object to convert the U.N. name to the name used in this application.
Simply edit this object as needed.

```js
const nameMappings = {
  // 'U.N. name': 'Our in-project name',
  'Antigua & Barbuda': 'Antigua and Barbuda',
  'U.K. of Great Britain and Northern Ireland': 'United Kingdom',
  'United States Virgin Islands': 'Virgin Islands',

  // ...
}
```
