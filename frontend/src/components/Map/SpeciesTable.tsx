interface Props {
  data: string
}

export const SpeciesTable = ({ data }: Props) => {
  if (!data || data.length === 0) return <p>No data available.</p>
  return <p>{data}</p>
}
