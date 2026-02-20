import { ReactNode } from 'react'
import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { UpdateTab } from './UpdateTab'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: () => ({ data: {} }),
}))

jest.mock('./EditingModal', () => ({
  EditingModal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('./SimpleTable', () => ({
  SimpleTable: () => <div data-testid="simple-table" />,
}))

jest.mock('./ReferenceList', () => ({
  ReferenceList: () => <div data-testid="reference-list" />,
}))

describe('UpdateTab', () => {
  it('renders placeholder message when placeholder mode is enabled', () => {
    render(<UpdateTab prefix="occ" placeholderMessage="Updates tab placeholder. Implementation is pending." />)

    expect(screen.getByText('Updates tab placeholder. Implementation is pending.')).toBeTruthy()
  })
})
