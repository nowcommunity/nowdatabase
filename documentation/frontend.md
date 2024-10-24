### Frontend explanation

**Data tables**

- [TableView](../frontend/src/components/TableView/TableView.tsx) is a generic component that takes in column definitions, data, and renders a [material-react-table (click for docs)](https://www.material-react-table.com/). It also handles the tables state management: for example saving column filters into url, and restoring them on first render. Creating a new [tableview](./creating_new_tableview.md) in more detail.

- [DetailView](../frontend/src/components/DetailView/)-folder has components that are used by the detailed view: The view which allows looking at and editing a single data item, for example a locality. The DetailView-component is generic, allowing different data types to use it.

**Example of a detail view rendering tree**

- [LocalityDetails.tsx](../frontend/src/components/Locality/LocalityDetails.tsx) queries the data with a RTK Query hook. It then defines tabs, which have a title and a component to render, and gives the tabs and data to a DetailView.

- **DetailView** then handles the state and renders the tabs, providing the tabs the [DetailContext](../frontend/src/components/DetailView/Context/DetailContext.tsx). This means that the tabs can access the state through the context, and the edited state is preserved even if the tab is changed.

- The tabs are where the actual layout of shown data is defined. The tab, as well as the components that it renders, can use the context to see if user is viewing or editing data. There are some ready hooks and components to display either a data or a component that allows editing the data. See [editingComponents-file](../frontend/src/components/DetailView/common/editingComponents.tsx). It has components for the commonly used layouts and functionalities. See example for usage in [AgeTab](../frontend/src/components/Locality/Tabs/AgeTab.tsx). Some important utility components in FormComponents-file:
  - The **DataValue** renders, depending on the mode (reading or editing), the value or a component that allows the user to edit the value.
  - The **ArrayFrame** allows you to write an entire "frame" (a grouping of data within a tab: for example in a Locality > Age tab > Age) as a two-dimensional array, which can contain for example labels or datavalues. See example in AgeTab. This is the best way to write most tabs.

**Detailed documentation for editingComponents**

[RadioSelector](./editingComponents/RadioSelector.md)
[DropDownSelector](./editingComponents/DropDownSelector.md)
[FieldWithTableSelection](./editingComponents/FieldWithTableSelection.md)
[TimeBoundSelection](./editingComponents/TimeBoundSelection.md)
[EditableTextField](./editingComponents/EditableTextField.md)
