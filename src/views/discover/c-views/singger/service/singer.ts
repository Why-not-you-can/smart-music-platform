import hyRequest from '@/service'

export function getArtistList(area, type, initial) {
  let url = '/artist/list'
  let params: { limit: number; [key: string]: any } = { limit: 100 }
  if (area === -1 && type === 1) {
    url = '/top/artists'
  } else {
    if (area === -1) {
      params = { limit: 100, cat: 5001 }
    } else {
      params = {
        type,
        area,
        initial,
        limit: 100
      }
    }
  }

  return hyRequest.get({
    url,
    params
  })
}
