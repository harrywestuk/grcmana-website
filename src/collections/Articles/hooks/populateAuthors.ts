import type { CollectionAfterReadHook } from 'payload'
import type { Author } from '@/payload-types'

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req: { payload } }) => {
  if (doc?.authors && doc?.authors?.length > 0) {
    const authorDocs: Author[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await payload.findByID({
          id: typeof author === 'object' ? author?.id : author,
          collection: 'authors',
          depth: 1,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }
      } catch {
        // swallow error
      }
    }

    if (authorDocs.length > 0) {
      doc.populatedAuthors = authorDocs.map((authorDoc) => ({
        id: String(authorDoc.id),
        name: authorDoc.name,
        avatar: authorDoc.avatar,
        bio: authorDoc.bio,
        linkedIn: authorDoc.linkedIn,
      }))
    }
  }

  return doc
}
