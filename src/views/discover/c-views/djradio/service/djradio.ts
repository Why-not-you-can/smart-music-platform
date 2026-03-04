import hyRequest from '@/service'

export function getDjCatlist() {
  return hyRequest.get({
    url: '/dj/catelist'
  })
}

export function getDjRecommend(type: number) {
  return hyRequest.get({
    url: '/dj/recommend/type',
    params: {
      type
    }
  })
}

export function getDjRadio(cateId: number, limit: number, offset: number) {
  return hyRequest.get({
    url: '/dj/hot',
    params: {
      limit,
      offset
    }
  })
}
