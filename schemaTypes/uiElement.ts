import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'uiElement',
  title: 'UI Element',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
