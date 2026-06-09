import React from 'react'

import { TableOfContents } from '@/components/TableOfContents'
import type { TocItem } from '@/components/TableOfContents'

export type ArticleLayoutProps = {
  toc: TocItem[]
  children: React.ReactNode
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({ toc, children }) => {
  return (
    <div className="container" style={{ paddingBlock: 'var(--section-y)' }}>
      <div className="article-layout">
        <aside className="article-layout__toc" aria-label="Article navigation">
          <TableOfContents toc={toc} />
        </aside>

        <div className="article-layout__content">{children}</div>
      </div>
    </div>
  )
}
