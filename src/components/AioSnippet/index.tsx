import type { Article } from '@/payload-types'
import { type DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  data: Article['aioSnippet']
}

export function AioSnippet({ data }: Props): React.ReactElement | null {
  if (!data) return null

  const { heading, summary, facts } = data
  const hasFacts = Array.isArray(facts) && facts.length > 0

  if (!summary && !hasFacts) return null

  return (
    <div className="max-w-[48rem] mx-auto mb-8 bg-signal-a06 border border-ds-border-signal p-6">
      <div className="flex items-center justify-between border-b border-ds-border pb-2.5 mb-4">
        <span className="font-mono text-2xs uppercase tracking-widest text-signal-500">
          {heading || 'Key Takeaways'}
        </span>
      </div>

      {summary && (
        <ConvertRichText
          data={summary as DefaultTypedEditorState}
          className="font-sans text-sm leading-relaxed text-ink-100 mb-4 [&_strong]:text-white [&_p]:m-0"
        />
      )}

      {hasFacts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facts!.map((fact, i) => (
            <div
              key={fact.id ?? i}
              className="flex flex-col bg-ink-950 border border-ds-border px-4 py-3"
            >
              <span className="font-mono text-2xs uppercase tracking-wider text-ink-300 mb-0.5">
                {fact.term}
              </span>
              <span className="font-sans text-xs font-semibold text-ink-100">
                {fact.definition}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
