import hyRequest from '@/service'

export function getHotAlbums() {
  return hyRequest.get({
    url: '/album/newest'
  })
}

export function getTopAlbums(limit, offset) {
  return hyRequest.get({
    url: '/album/new',
    params: {
      limit,
      offset
    }
  })
}

export function getAlbumDetial(id) {
  return hyRequest.get({
    url: '/album/detail',
    params: {
      id
    }
  })
}
