const { createClient } = require('contentful/dist/contentful.browser.min.js')

const contentfulClient = createClient({
  accessToken: '1fc14b33307ef4cdcb67042053430313b293e13816b28ca488802478df7e1e0f',
  space: 'u26tmkqoc2fn'
})

export const getFixedTokens = async () => {
  const { items: featuredTokens } = await contentfulClient.getEntries({
    content_type: 'asset',
    order: '-fields.isFeatured,fields.position',
    select: 'fields.name,fields.isFeatured,fields.position,fields.featuredCover'
  })
  const featured = []
  const featuredRef = []
  const verified = []
  featuredTokens.map(({fields}) => {
    if (fields.isFeatured) {
      featuredRef.push(fields.name)
      featured.push({name: fields.name, image: `https:${fields.featuredCover.fields.file.url}`})
    } else {
      verified.push(fields.name)
    }
  })
  return {fixedTokens: [...featuredRef, ...verified], featured, verified}
}
