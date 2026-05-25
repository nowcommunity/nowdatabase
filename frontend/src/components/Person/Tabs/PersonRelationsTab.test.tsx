import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PersonRelationsTab } from './PersonRelationsTab'
import { PersonDetailsType } from '@/shared/types'

const mockUseDetailContext = jest.fn()

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: () => mockUseDetailContext(),
}))

const person = {
  project_relations: [
    {
      pid: 3,
      proj_code: 'NOW',
      proj_name: 'NOW Database',
      proj_status: 'current',
      relation: 'Contact',
    },
    {
      pid: 14,
      proj_code: 'WINE',
      proj_name: 'Workgroup on Insectivores',
      proj_status: 'current',
      relation: 'Member',
    },
  ],
  coordinator_relations: [
    {
      id: 2,
      type: 'Region',
      name: 'Europe',
    },
    {
      id: 7,
      type: 'Taxa',
      name: 'Carnivora',
      details: 'Carnivora / Felidae',
    },
    {
      id: 5,
      type: 'Stratigraphy',
      name: 'European Neogene',
    },
  ],
} as PersonDetailsType

describe('PersonRelationsTab', () => {
  it('lists project and coordinator relations', () => {
    mockUseDetailContext.mockReturnValue({ data: person })

    render(
      <MemoryRouter>
        <PersonRelationsTab />
      </MemoryRouter>
    )

    expect(screen.getByText('Project Relations')).toBeTruthy()
    expect(screen.getByText('NOW Database')).toBeTruthy()
    expect(screen.getByText('Contact')).toBeTruthy()
    expect(screen.getByText('Workgroup on Insectivores')).toBeTruthy()
    expect(screen.getByText('Member')).toBeTruthy()

    expect(screen.getByText('Coordinator Relations')).toBeTruthy()
    expect(screen.getByText('Region')).toBeTruthy()
    expect(screen.getByText('Europe')).toBeTruthy()
    expect(screen.getByText('Taxa')).toBeTruthy()
    expect(screen.getByText('Carnivora / Felidae')).toBeTruthy()
    expect(screen.getByText('Stratigraphy')).toBeTruthy()
  })

  it('shows empty messages when no relations exist', () => {
    mockUseDetailContext.mockReturnValue({
      data: { project_relations: [], coordinator_relations: [] },
    })

    render(
      <MemoryRouter>
        <PersonRelationsTab />
      </MemoryRouter>
    )

    expect(screen.getAllByText('No relations.')).toHaveLength(2)
  })
})
