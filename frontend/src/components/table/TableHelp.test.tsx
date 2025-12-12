import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { TableHelp } from './TableHelp'

describe('TableHelp', () => {
  const openPopover = () => {
    const button = screen.getByRole('button', { name: /table help/i })
    fireEvent.click(button)
  }

  it('renders help tips for enabled features', () => {
    render(<TableHelp showFiltering showSorting showMultiSorting showColumnVisibility showExport />)

    openPopover()

    expect(screen.getByText('Filter rows using the column filter icons or quick search where available.')).toBeTruthy()
    expect(screen.getByText('Click a column header to sort ascending/descending by that column.')).toBeTruthy()
    expect(screen.getByText('Hold Shift while clicking column headers to apply multi-column sorting.')).toBeTruthy()
    expect(screen.getByText('Use the column visibility menu to show or hide columns that matter to you.')).toBeTruthy()
    expect(screen.getByText('Export the current table data using the export menu (e.g., CSV).')).toBeTruthy()
  })

  it('omits tips for disabled features', () => {
    render(<TableHelp showSorting />)

    openPopover()

    expect(screen.queryByText(/Filter rows using the column filter icons/i)).toBeNull()
    expect(screen.queryByText(/Hold Shift while clicking column headers/i)).toBeNull()
    expect(screen.queryByText(/column visibility menu/i)).toBeNull()
    expect(screen.queryByText(/export menu/i)).toBeNull()
    expect(screen.getByText('Click a column header to sort ascending/descending by that column.')).toBeTruthy()
  })

  it('is keyboard accessible with aria label and descriptive popover id', () => {
    render(<TableHelp />)

    const button = screen.getByRole('button', { name: /table help/i })

    expect(button.getAttribute('aria-label')).toBe('Open table help')
    
    // aria-describedby should be undefined when popover is closed
    expect(button.getAttribute('aria-describedby')).toBeNull()
    
    // When popover is open, aria-describedby should be set
    fireEvent.click(button)
    expect(button.getAttribute('aria-describedby')).toBe('table-help-popover')
  })
})
