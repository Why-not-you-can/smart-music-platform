import hyRequest from '@/service'

export function getSearch(keywords: string, limit = 30, offset = 0, type = 1) {
  return hyRequest.get({
    url: '/search',
    params: {
      keywords,
      limit,
      offset,
      type
    }
  })
}
