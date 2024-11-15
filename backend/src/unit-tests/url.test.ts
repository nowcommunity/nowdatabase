import { describe, it, expect } from '@jest/globals'
import { constructFilterSortPageUrl } from '../utils/url'

import type { ColumnFilter, Sorting, Page } from '../../../frontend/src/backendTypes'

describe('constructFilterSortPageUrl', () => {
  it('constructs the correct empty string without any parameters', () => {
    const result = constructFilterSortPageUrl()
    expect(result).toEqual('&columnfilters=[]&sorting=[]&pagination={}')
  })

  it('constructs the correct filter string with filter obj', () => {
    const columnFilter: ColumnFilter = {
      country: 'S',
      genus_name: 'Pe',
    }

    const result = constructFilterSortPageUrl(columnFilter)
    expect(result).toEqual(
      '&columnfilters=[{"id":"country","value":"S"},{"id":"genus_name","value":"Pe"}]&sorting=[]&pagination={}'
    )
  })
  it('constructs the correct sorting string with filter obj', () => {
    const sorting: Sorting = {
      id: 'country',
      desc: true,
    }
    const result = constructFilterSortPageUrl([], sorting)
    expect(result).toEqual('&columnfilters=[]&sorting=[{"id":"country","desc":true}]&pagination={}')
  })
  it('constructs the correct page string with filter obj', () => {
    const page: Page = {
      pageIndex: 5,
      pageSize: 50,
    }
    const result = constructFilterSortPageUrl([], [], page)
    expect(result).toEqual('&columnfilters=[]&sorting=[]&pagination={"pageIndex":5,"pageSize":50}')
  })
  it('constructs the correct url with the correct objects', () => {
    const columnFilter: ColumnFilter = {
      country: 'S',
      genus_name: 'Pe',
    }
    const sorting: Sorting = {
      id: 'country',
      desc: true,
    }
    const page: Page = {
      pageIndex: 5,
      pageSize: 50,
    }
    const result = constructFilterSortPageUrl(columnFilter, sorting, page)
    expect(result).toEqual(
      '&columnfilters=[{"id":"country","value":"S"},{"id":"genus_name","value":"Pe"}]&sorting=[{"id":"country","desc":true}]&pagination={"pageIndex":5,"pageSize":50}'
    )
  })
})
