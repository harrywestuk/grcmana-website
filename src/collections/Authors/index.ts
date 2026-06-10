import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateAuthor, revalidateDelete } from './hooks/revalidateAuthor'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Authors: CollectionConfig<'authors'> = {
  slug: 'authors',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    avatar: true,
    role: true,
    bio: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'slug', '_status'],
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
              admin: {
                description: '150–300 characters. Used on article bylines.',
              },
            },
            {
              name: 'bioExtended',
              type: 'richText',
              label: 'Extended Bio',
            },
          ],
        },
        {
          label: 'Credentials',
          fields: [
            {
              name: 'yearsExperience',
              type: 'number',
              label: 'Years of Experience',
            },
            {
              name: 'credentials',
              type: 'array',
              // Byline components should surface a maximum of 3 credentials as compact badges
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Credential',
                },
                {
                  name: 'issuer',
                  type: 'text',
                },
                {
                  name: 'year',
                  type: 'number',
                  label: 'Year Awarded',
                },
                {
                  name: 'verificationUrl',
                  type: 'text',
                  label: 'Verification URL',
                },
                {
                  name: 'verificationPlatform',
                  type: 'select',
                  label: 'Verification Platform',
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
              admin: {
                description: 'Topic tags rendered as badges on the profile page and article byline.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'organisations',
              type: 'array',
              label: 'Organisations',
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
                  label: 'Website',
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'website', type: 'text', label: 'Website' },
            { name: 'linkedIn', type: 'text', label: 'LinkedIn' },
            { name: 'twitter', type: 'text', label: 'X / Twitter' },
            { name: 'github', type: 'text', label: 'GitHub' },
            { name: 'youtube', type: 'text', label: 'YouTube' },
            { name: 'medium', type: 'text', label: 'Medium' },
            { name: 'facebook', type: 'text', label: 'Facebook' },
            { name: 'instagram', type: 'text', label: 'Instagram' },
            { name: 'pinterest', type: 'text', label: 'Pinterest' },
            { name: 'tiktok', type: 'text', label: 'TikTok' },
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
    slugField({ useAsSlug: 'name' }),
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
