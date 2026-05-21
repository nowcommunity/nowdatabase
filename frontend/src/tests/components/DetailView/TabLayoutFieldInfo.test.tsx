import { render, screen } from '@testing-library/react'
import { ArrayToTable } from '@/components/DetailView/common/tabLayoutHelpers'

const FieldElement = (_props: { field: string }) => <span>field value</span>

describe('ArrayToTable field info labels', () => {
  it('shows field information for labels next to known fields', () => {
    render(<ArrayToTable array={[['Body mass', <FieldElement key="body_mass" field="body_mass" />]]} />)

    expect(screen.getByLabelText('Field information for Body mass')).toBeInTheDocument()
  })

  it('shows field information for locality and reference fields', () => {
    render(
      <ArrayToTable
        array={[
          ['Locality name', <FieldElement key="loc_name" field="loc_name" />],
          ['Reference title', <FieldElement key="title_primary" field="title_primary" />],
        ]}
      />
    )

    expect(screen.getByLabelText('Field information for Locality name')).toBeInTheDocument()
    expect(screen.getByLabelText('Field information for Reference title')).toBeInTheDocument()
  })

  it('does not show field information for labels next to unknown fields', () => {
    render(<ArrayToTable array={[['Unknown field', <FieldElement key="unknown_field" field="unknown_field" />]]} />)

    expect(screen.queryByLabelText('Field information for Unknown field')).not.toBeInTheDocument()
  })
})
