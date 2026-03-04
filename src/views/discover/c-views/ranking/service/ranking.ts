import hyRequest from '@/service'

export function getTopList() {
  return hyRequest.get({
    url: '/toplist'
  })
}

export function getTopDetail(id: number) {
  return hyRequest.get({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}
