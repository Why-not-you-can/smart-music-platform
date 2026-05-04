import hyRequest from '@/service'

export function getSongCategory() {
  return hyRequest.get({
    url: '/playlist/catlist'
  })
}

export function getSongCategoryList(cat = '全部', offset = 0) {
  return hyRequest.get({
    url: '/top/playlist',
    params: {
      cat,
      offset
    }
  })
}

export function getAllPlayListSongs(id: number, limit, offset = 0) {
  return hyRequest.get({
    url: '/playlist/track/all',
    params: {
      id,
      limit,
      offset
    }
  })
}

export function getPlaylistDetail(id: number) {
  return hyRequest.get({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}

export function getSimiPlaylist(id: number) {
  return hyRequest.get({
    url: '/related/playlist',
    params: {
      id
    }
  })
}
