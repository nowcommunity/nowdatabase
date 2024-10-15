import { MRT_VisibilityState } from 'material-react-table';

export const columnCategoryToggler = (visibleColumns: MRT_VisibilityState, setVisibleColumns: (columns: MRT_VisibilityState) => void, columns: string[], buttonstate: boolean) => {
  if (buttonstate) {
    const filteredColumns = Object.keys(visibleColumns)
      .filter((key) => !columns.includes(key))
      .reduce((obj, key) => {
        obj[key] = visibleColumns[key];
        return obj;
      }, {} as MRT_VisibilityState);
    setVisibleColumns(filteredColumns);
  } else {
    columns.forEach((column) => {
      if (!visibleColumns[column]) {
        setVisibleColumns({ ...visibleColumns, [column]: false });
      }
    })
  }
  return { buttonstate: !buttonstate };
}

export const buttonStateToggler = (buttonstate: boolean) => {
  return !buttonstate;
}
