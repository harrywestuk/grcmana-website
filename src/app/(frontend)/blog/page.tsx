import type { Metadata } from 'next/types'

import { BlogMatrixClient } from '@/components/BlogMatrix/Client'
import { BlogMatrixIntro } from '@/components/BlogMatrix/Intro'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page(): Promise<React.JSX.Element> {
  const payload = await getPayload({ config: configPromise })

  const [articles, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 12,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        titleEmphasis: true,
        slug: true,
        categories: true,
        excerpt: true,
        publishedAt: true,
        authors: true,
        populatedAuthors: true,
        readTime: true,
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
    }),
  ])

  return (
    <div style={{ paddingTop: 'var(--section-y-hero)', paddingBottom: 'var(--section-y)' }}>
      <PageClient />
      <BlogMatrixIntro />
      <Suspense>
        <BlogMatrixClient
          posts={articles.docs}
          categories={categoriesResult.docs}
        />
      </Suspense>
      {articles.totalPages > 1 && articles.page && (
        <div style={{ maxWidth: 'var(--container-max)', marginInline: 'auto', paddingInline: 'var(--gutter)' }}>
          <Pagination page={articles.page} totalPages={articles.totalPages} />
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `GRCMANA Blog`,
  }
}
