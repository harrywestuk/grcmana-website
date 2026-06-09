import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Author } from '../../../payload-types'

export const revalidateAuthor: CollectionAfterChangeHook<Author> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/authors/${doc.slug}`

      payload.logger.info(`Revalidating author at path: ${path}`)

      revalidatePath(path)
      revalidateTag('authors-sitemap', 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/authors/${previousDoc.slug}`

      payload.logger.info(`Revalidating old author at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('authors-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Author> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/authors/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('authors-sitemap', 'max')
  }

  return doc
}
