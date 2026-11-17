import { describe, expect, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getLastMaterialReactTableOptions } from 'material-react-table'
import { NotificationContextProvider } from '@/components/Notification'
import { PageContextProvider } from '@/components/Page'
import { TableView } from '@/components/TableView/TableView'
import { store } from '@/redux/store'

type CapturedMrtOptions = {
  enableTopToolbar?: boolean
  positionPagination?: 'top' | 'bottom' | 'both'
}

describe('TableView pagination', () => {
  it('places selector pagination in the enabled bottom toolbar by default', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NotificationContextProvider>
            <PageContextProvider
              editRights={{}}
              idFieldName="id"
              viewName="test"
              createTitle={() => ''}
              createSubtitle={() => ''}
            >
              <TableView
                title="Test"
                idFieldName="id"
                columns={[{ accessorKey: 'name', header: 'Name' }]}
                visibleColumns={{}}
                data={[{ id: '1', name: 'Alpha' }]}
                isFetching={false}
                selectorFn={() => undefined}
              />
            </PageContextProvider>
          </NotificationContextProvider>
        </MemoryRouter>
      </Provider>
    )

    const options = getLastMaterialReactTableOptions<CapturedMrtOptions>()

    expect(options).toMatchObject({
      enableTopToolbar: false,
      positionPagination: 'bottom',
    })
  })
})
