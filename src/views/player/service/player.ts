import hyRequest from '@/service'

export function getSongDetail(ids: number) {
  return hyRequest.get({
    url: '/song/detail',
    params: {
      ids
    }
  })
}

export function getSongLyric(id: number) {
  return hyRequest.get({
    url: '/lyric',
    params: {
      id
    }
  })
}

export function getSimiSongs(id: number) {
  return hyRequest.get({
    url: '/simi/song',
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
