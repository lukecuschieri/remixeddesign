import {defineType, defineField, defineArrayMember} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'
import {FigmaClipboardInput} from '../components/FigmaClipboardInput'

export default defineType({
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    orderRankField({type: 'resource'}),
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Clear name used to identify this resource everywhere in the CMS',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'URL-friendly identifier for deep linking (e.g. media-widgets). When empty, resource _id is used in the URL.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'mainImage',
      title: 'Thumbnail / Preview',
      description: 'Supports static images and animated GIFs',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif,.webp',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      description: 'Link to the original resource',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'sourceName',
      title: 'Source name',
      description: 'Author or source name shown as link label (e.g. Figma Community)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'figmaCode',
      title: 'Figma code',
      description:
        'HTML with figmeta from Figma native copy. In Figma: select vector/shape layers → Right‑click → Copy (not Copy as SVG). Paste here to store; use Copy button to copy back into Figma for editable vector nodes.',
      type: 'text',
      rows: 12,
      components: {
        input: FigmaClipboardInput,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'tag'}],
        }),
      ],
    }),
    defineField({
      name: 'uiElements',
      title: 'UI Elements',
      description: 'UI component types that appear in this resource (e.g. Button, Toggle, Icon button)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'uiElement'}],
        }),
      ],
    }),
    defineField({
      name: 'application',
      title: 'Application',
      description: 'App or product this resource is based on or inspired by',
      type: 'reference',
      to: [{type: 'application'}],
    }),
  ],
})
