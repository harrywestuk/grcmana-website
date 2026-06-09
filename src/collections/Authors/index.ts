import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { revalidateAuthor, revalidateDelete } from './hooks/revalidateAuthor'

export const Authors: CollectionConfig = {
  slug: 'authors',
  defaultPopulate: {
    name: true,
    slug: true,
    avatar: true,
    role: true,
    bio: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'slug', 'status'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'authors',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'authors',
        req,
      }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
    },
    slugField({ useAsSlug: 'name' }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'bio',
              type: 'textarea',
            },
            {
              name: 'bioExtended',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Credentials',
          fields: [
            {
              name: 'credentials',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                },
                {
                  name: 'issuer',
                  type: 'text',
                },
                {
                  name: 'year',
                  type: 'number',
                },
                {
                  name: 'verificationUrl',
                  type: 'text',
                },
                {
                  name: 'verificationPlatform',
                  type: 'select',
                  options: [
                    { label: 'Credly', value: 'credly' },
                    { label: 'Issuer', value: 'issuer' },
                    { label: 'Other', value: 'other' },
                  ],
                },
              ],
            },
            {
              name: 'expertise',
              type: 'array',
              fields: [
                {
                  name: 'topic',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'yearsExperience',
              type: 'number',
            },
            {
              name: 'organisations',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'role',
                  type: 'text',
                },
                {
                  name: 'url',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'linkedIn',
              type: 'text',
            },
            {
              name: 'twitter',
              type: 'text',
            },
            {
              name: 'github',
              type: 'text',
            },
            {
              name: 'youtube',
              type: 'text',
            },
            {
              name: 'medium',
              type: 'text',
            },
            {
              name: 'facebook',
              type: 'text',
            },
            {
              name: 'instagram',
              type: 'text',
            },
            {
              name: 'pinterest',
              type: 'text',
            },
            {
              name: 'tiktok',
              type: 'text',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateAuthor],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
