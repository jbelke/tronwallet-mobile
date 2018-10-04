import { createClient } from 'contentful/dist/contentful.browser.min.js'
import { CONTENTFUL_TOKEN, CONTENTFUL_SPACE } from '../../config.js'

const contentfulClient = createClient({accessToken: CONTENTFUL_TOKEN, space: CONTENTFUL_SPACE})

export const BATCH_NUMBER = 30

const defaultQuery = {
  content_type: 'asset',
  order: '-fields.isFeatured,-fields.isVerified,fields.position,-fields.issuedPercentage',
  'fields.issuedPercentage[lt]': 100,
  'fields.startTime[lt]': Date.now(),
  'fields.endTime[gte]': Date.now()
}
export const tokenInfoQuery = {
  content_type: 'asset',
  order: '-fields.isFeatured,-fields.isVerified,fields.position,-fields.issuedPercentage'
}

export const getTokens = async (verifiedOnly = false, start = 0) => {
  const queryEntry = {
    ...defaultQuery,
    skip: start,
    limit: BATCH_NUMBER
  }

  if (verifiedOnly) queryEntry['fields.isVerified'] = true

  const { total, items: featuredTokens } = await contentfulClient.getEntries(queryEntry)
  const featured = []
  const assets = []

  featuredTokens.map(({fields: token}) => {
    if (token.isFeatured) {
      const image = token.featuredCover ? `https:${token.featuredCover.fields.file.url}` : null
      featured.push({...token, image})
    } else {
      assets.push(token)
    }
  })
  return {featured, assets, totalTokens: total}
}

export const queryToken = async (verifiedOnly = false, name = '', query = defaultQuery) => {
  const queryEntry = {
    ...query,
    'fields.name[match]': name
  }
  if (verifiedOnly) queryEntry['fields.isVerified'] = true

  const { total, items: results } = await contentfulClient.getEntries(queryEntry)

  return { total, results }
}

export const getFixedTokens = async () => {
  const queryEntry = {
    content_type: 'asset',
    order: '-fields.isFeatured,fields.position',
    select: 'fields.name',
    'fields.isVerified': true
  }

  const { items: featuredTokens } = await contentfulClient.getEntries(queryEntry)
  const fixedNames = featuredTokens.map(({fields: token}) => token.name)
  return ['TRX', ...fixedNames]
}
