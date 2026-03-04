import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { AlbumCoverWrapper } from './style'
import { getImageSize } from '@/utlis/format'
import { fetchAlbumDetialAction } from '@/views/discover/c-views/album/store/album'
import { useAppDispatch } from '@/store'
import {
  changePlaySongIndexAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
  info?: any
  size?: any
  width?: any
  bgp?: any
}

const AlbumCover: FC<IProps> = (props) => {
  const { info, size = '100px', width = '118px', bgp = '-570px' } = props

  const dispatch = useAppDispatch()
  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!info?.id) return
    const result = await dispatch(fetchAlbumDetialAction(info.id))
    const albums = result.payload as any[]
    if (albums && albums.length > 0) {
      dispatch(changePlaySongListAction(albums))
      dispatch(changePlaySongIndexAction(0))
      dispatch(fetchCurrentSongAction(albums[0].id))
    }
  }

  return (
    <AlbumCoverWrapper size={size} width={width} bgp={bgp}>
      <div className="album-image">
        <img src={getImageSize(info.picUrl, 150)} alt="" />
        <a href="/abc" className="cover sprite_cover">
          {info.name}
        </a>
        <button className="play sprite_icon" onClick={handlePlay}></button>
      </div>
      <div className="album-info">
        <div className="name">{info.name}</div>
        <div className="artist">{info.artist.name}</div>
      </div>
    </AlbumCoverWrapper>
  )
}

export default memo(AlbumCover)
