interface Props {
  data: string[][] | null
}

export const SpeciesTable = ({ data }: Props) => {
  const columns = [
    { label: 'Subclass or Superorder', index: 51 },
    { label: 'Order', index: 48 },
    { label: 'Suborder or Superfamily', index: 52 },
    { label: 'Family', index: 49 },
    { label: 'Subfamily or Tribe', index: 50 }, // ei datassa samalla nimellä (subfamily_name?)
    { label: 'Genus', index: 53 },
    { label: 'Species', index: 54 },
    { label: 'Unique Identifier', index: 55 },
    { label: 'Synonyms and synonym comments', index: 93 }, // datassa indexit 93, 94
  ]

  const cleanValue = (val: string) => val.replace(/^"|"$/g, '')
  const speciesData = data && data.length > 1 ? data.slice(1) : []

  if (!speciesData || speciesData.length === 0) return <p>No species available.</p>
  return (
    <div className="species-table">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.label}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {speciesData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => (
                <td key={col.label}>{row[col.index] ? cleanValue(row[col.index]) : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
