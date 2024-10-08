import { MRT_VisibilityState } from 'material-react-table';
import { useState } from 'react';

export const columnCategoryToggler = (visibleColumns: MRT_VisibilityState, columnCategory: string[], buttonstate: boolean) => {
  const [newVisibleColumns, setNewVisibleColumns] = useState(visibleColumns) as [MRT_VisibilityState, (visibleColumns: MRT_VisibilityState) => void];
  if (buttonstate) {
    const filteredColumns = Object.keys(newVisibleColumns)
      .filter((key) => !columnCategory.includes(key))
      .reduce((obj, key) => {
        obj[key] = newVisibleColumns[key];
        return obj;
      }, {} as MRT_VisibilityState);
    setNewVisibleColumns(filteredColumns);
  } else {
    columnCategory.forEach((category) => {
      if (!newVisibleColumns[category]) {
        setNewVisibleColumns({ ...newVisibleColumns, [category]: false });
      }
    })
  }
  return { newVisibleColumns, buttonstate: !buttonstate };
}