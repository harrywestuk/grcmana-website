import type { Metadata } from 'next/types'

import { BlogMatrixClient } from '@/components/BlogMatrix/Client'
import { BlogMatrixIntro } from '@/components/BlogMatrix/Intro'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args): Promise<React.JSX.Element> {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const [articles, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 12,
      page: sanitizedPageNumber,
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
      {articles.page && articles.totalPages > 1 && (
        <div style={{ maxWidth: 'var(--container-max)', marginInline: 'auto', paddingInline: 'var(--gutter)' }}>
          <Pagination page={articles.page} totalPages={articles.totalPages} />
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `GRCMANA Blog — Page ${pageNumber}`,
  }
}

export async function generateStaticParams(): Promise<{ pageNumber: string }[]> {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'articles',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12)
  const pages: { pageNumber: string }[] = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
