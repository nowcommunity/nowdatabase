# Country data conversion script

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

## Usage

The script can be run with `node` and accepts a single command line argument, the country border `.geojson` filepath.
For example to convert the already included `.geojson` in this directory one would run:

```
$ node countryExport.js world-administrative-boundaries.geojson
```

Which will either quietly create the aforementioned files in this directory or crash with an error.

### Country name mappings

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
