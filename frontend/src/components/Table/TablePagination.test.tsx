import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { TablePagination } from './TablePagination'
import type { TablePaginationMetadata } from '@/redux/slices/tablesSlice'

describe('TablePagination', () => {
  const baseMetadata: TablePaginationMetadata = {
    pageIndex: 0,
    pageSize: 10,
    totalItems: 100,
    totalPages: 10,
  }

  it('renders pagination summary and controls', () => {
    render(<TablePagination metadata={baseMetadata} />)

    const previousButton = screen.getByRole('button', { name: 'Go to previous page' })
    const nextButton = screen.getByRole('button', { name: 'Go to next page' })

    expect(screen.getByText('Showing 1-10 of 100')).toBeDefined()
    expect(previousButton.hasAttribute('disabled')).toBe(true)
    expect(nextButton.hasAttribute('disabled')).toBe(false)
  })

  it('invokes change handler when navigating', () => {
    const handleChange = jest.fn()

    render(<TablePagination metadata={{ ...baseMetadata, pageIndex: 1 }} onPageChange={handleChange} />)

    const previousButton = screen.getByRole('button', { name: 'Go to previous page' })

    fireEvent.click(previousButton)

    expect(handleChange).toHaveBeenCalledWith(0)
  })

  it('disables next button on last page', () => {
    render(<TablePagination metadata={{ ...baseMetadata, pageIndex: 9 }} />)

    const nextButton = screen.getByRole('button', { name: 'Go to next page' })

    expect(nextButton.hasAttribute('disabled')).toBe(true)
  })
})
