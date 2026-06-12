import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import RichText from '@/components/RichText'

import { AioSnippet } from '@/components/AioSnippet'
import { ArticleFooter } from '@/components/ArticleFooter'
import { ArticleToc } from '@/components/ArticleToc'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const articles = await payload.find({
    collection: 'articles',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = articles.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ArticlePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const article = await queryArticleBySlug({ slug: decodedSlug })

  if (!article) return <PayloadRedirects url={url} />

  const toc = article.toc ?? []

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={article} />

      <main className="article-layout pt-12">
        <div className="article-layout__inner">
          <aside className="toc-sidebar">
            <ArticleToc toc={toc} />
          </aside>

          <section className="article-body-canvas article-body">
            <AioSnippet data={article.aioSnippet} />
            <RichText data={article.content} enableGutter={false} addHeadingIds />
          </section>
        </div>
      </main>

      <footer className="article-layout article-footer-layout">
        <div className="article-layout__inner">
          <div className="article-footer__placeholder" aria-hidden="true" />
          <ArticleFooter article={article} />
        </div>
      </footer>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const article = await queryArticleBySlug({ slug: decodedSlug })

  return generateMeta({ doc: article })
}

const queryArticleBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'articles',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
