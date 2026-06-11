import type { Article, Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardPostData } from '@/components/Card'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    relationTo,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3
  const collection = relationTo === 'articles' ? 'articles' : 'posts'

  let docs: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    if (collection === 'articles') {
      const fetched = await payload.find({
        collection: 'articles',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? { where: { categories: { in: flattenedCategories } } }
          : {}),
      })
      docs = fetched.docs as Article[]
    } else {
      const fetched = await payload.find({
        collection: 'posts',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? { where: { categories: { in: flattenedCategories } } }
          : {}),
      })
      docs = fetched.docs as Post[]
    }
  } else {
    if (selectedDocs?.length) {
      docs = selectedDocs
        .filter((doc) => typeof doc.value === 'object')
        .map((doc) => doc.value) as (Post | Article)[]
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={docs} relationTo={collection} />
    </div>
  )
}
