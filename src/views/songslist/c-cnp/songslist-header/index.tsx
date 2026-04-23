import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { SongsListHeaderWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSongsListAction } from '../../store/songslist'

interface IProps {
  children?: ReactNode
}
const SongsListHeader: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const songs = useAppSelector((state) => state.songslist.songs)
  useEffect(() => {
    dispatch(fetchSongsListAction())
  }, [dispatch])
  const tracks = songs?.tracks || []
  return (
    <SongsListHeaderWrapper>
      <div className="header-info">
        <h3 className="list-title">歌曲列表</h3>
        <span className="list-song">{tracks.length}首歌</span>
      </div>
    </SongsListHeaderWrapper>
  )
}

export default memo(SongsListHeader)
