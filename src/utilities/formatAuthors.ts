export const formatAuthors = (authors: { name?: string | null }[]): string => {
  const authorNames = authors
    .map((author) => author.name)
    .filter((name): name is string => typeof name === 'string' && name.length > 0)

  if (authorNames.length === 0) return ''
  if (authorNames.length === 1) return authorNames[0] ?? ''
  if (authorNames.length === 2) return `${authorNames[0] ?? ''} and ${authorNames[1] ?? ''}`

  return `${authorNames.slice(0, -1).join(', ')} and ${authorNames.at(-1) ?? ''}`
}
