import React, { memo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { SongsListWrapper } from './style'
import { fetchSongsListAction } from './store/songslist'
import SongslistHeader from './c-cnp/songslist-header'
import List from './c-cnp/list'

const SongsList: React.FC = () => {
  const dispatch = useAppDispatch()
  const songs = useAppSelector((state) => state.songslist.songs)
  useEffect(() => {
    dispatch(fetchSongsListAction())
  }, [dispatch])
  if (!songs) {
    return (
      <SongsListWrapper className="wrap-v2">
        <div className="play-list">加载中...</div>
      </SongsListWrapper>
    )
  }
  return (
    <SongsListWrapper className="wrap-v2">
      <SongslistHeader />
      <List />
    </SongsListWrapper>
  )
}

export default memo(SongsList)
