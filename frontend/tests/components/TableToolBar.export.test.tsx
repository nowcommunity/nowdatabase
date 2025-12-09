import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { MRT_RowData, MRT_TableInstance } from 'material-react-table'
import { TableToolBar } from '../../src/components/TableView/TableToolBar'

jest.mock('../../src/components/DetailView/common/ContactForm', () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}))

jest.mock('../../src/components/CrossSearch/CrossSearchExportMenuItem', () => ({
  CrossSearchExportMenuItem: ({ handleClose }: { handleClose: () => void }) => (
    <button type="button" onClick={handleClose}>
      Cross search export
    </button>
  ),
}))

jest.mock('../../src/components/Page', () => ({
  usePageContext: () => ({
    previousTableUrls: [],
    setPreviousTableUrls: jest.fn(),
  }),
}))

jest.mock('material-react-table', () => ({
  MRT_ShowHideColumnsButton: () => <button type="button">Show/Hide</button>,
}))

describe('TableToolBar export menu', () => {
  it('omits the species export option while keeping other exports available', async () => {
    const { container } = render(
      <MemoryRouter>
        <TableToolBar
          table={{} as MRT_TableInstance<MRT_RowData>}
          tableName="Localities"
          kmlExport={jest.fn()}
          svgExport={jest.fn()}
        />
      </MemoryRouter>
    )

    const exportButton = container.querySelector('#export-button') as HTMLButtonElement
    fireEvent.click(exportButton)

    expect(screen.queryByText(/Export localities with their species/i)).toBeNull()
    expect(await screen.findByText('Export table')).toBeTruthy()
    expect(screen.getByText('Export KML')).toBeTruthy()
    expect(screen.getByText('Export SVG map')).toBeTruthy()
  })
})
