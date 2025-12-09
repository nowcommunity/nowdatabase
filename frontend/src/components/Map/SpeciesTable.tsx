import { LocalitySpeciesDetailsType, SpeciesSynonym } from '@/shared/types'

interface Props {
  data: LocalitySpeciesDetailsType[] | undefined
}

const formatSynonyms = (synonyms: SpeciesSynonym[], speciesComment: string | null) => {
  const synonymText = synonyms
    .map(({ syn_genus_name, syn_species_name, syn_comment }) => {
      const name = [syn_genus_name, syn_species_name].filter(Boolean).join(' ')
      if (!name && !syn_comment) return null
      return [name, syn_comment].filter(Boolean).join(' – ')
    })
    .filter(Boolean)
    .join('; ')

  return [synonymText, speciesComment].filter(Boolean).join('; ')
}

export const SpeciesTable = ({ data }: Props) => {
  const columns = [
    {
      label: 'Subclass or Superorder',
      accessor: (row: LocalitySpeciesDetailsType) => row.com_species.subclass_or_superorder_name,
    },
    { label: 'Order', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.order_name },
    {
      label: 'Suborder or Superfamily',
      accessor: (row: LocalitySpeciesDetailsType) => row.com_species.suborder_or_superfamily_name,
    },
    { label: 'Family', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.family_name },
    { label: 'Subfamily or Tribe', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.subfamily_name },
    { label: 'Genus', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.genus_name },
    { label: 'Species', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.species_name },
    { label: 'Unique Identifier', accessor: (row: LocalitySpeciesDetailsType) => row.com_species.unique_identifier },
    {
      label: 'Synonyms and synonym comments',
      accessor: (row: LocalitySpeciesDetailsType) =>
        formatSynonyms(row.com_species.com_taxa_synonym ?? [], row.com_species.sp_comment ?? null),
    },
  ] as const

  const speciesData = data ?? []

  if (speciesData.length === 0) return <p>No species available.</p>
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
          {speciesData.map(row => (
            <tr key={row.com_species.species_id}>
              {columns.map(col => (
                <td key={col.label}>{col.accessor(row) ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
