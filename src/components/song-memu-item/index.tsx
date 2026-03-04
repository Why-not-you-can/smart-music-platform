import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { MenuItemWrapper } from './style'
import { formatCount, getImageSize } from '@/utlis/format'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSongsDetailAction } from '@/views/discover/c-views/songs/store/song'
import {
  changePlaySongIndexAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'
interface IProps {
  children?: ReactNode
  itemData: any
}

const SongMenuItem: FC<IProps> = (props) => {
  const { itemData } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { songsDetail } = useAppSelector((state) => state.song)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGoToDetail = async () => {
    await dispatch(fetchSongsDetailAction(itemData.id)).unwrap()
    navigate(`/discover/playlist`)
  }

  useEffect(() => {
    if (isPlaying && songsDetail?.tracks?.length) {
      dispatch(changePlaySongListAction(songsDetail.tracks))
      dispatch(changePlaySongIndexAction(0))
      dispatch(fetchCurrentSongAction(songsDetail.tracks[0].id))
      setIsPlaying(false)
    }
  }, [songsDetail, dispatch, isPlaying])

  const handlePlayPlaylist = () => {
    setIsPlaying(true)
    dispatch(fetchSongsDetailAction(itemData.id))
  }

  return (
    <MenuItemWrapper>
      <div className="top">
        <div
          className="img-container"
          onClick={handleGoToDetail}
          style={{ cursor: 'pointer' }}
        >
          <img src={getImageSize(itemData.picUrl, 140)} alt="" />
        </div>
        <div className="cover sprite_cover">
          <div className="info sprite_cover">
            <span>
              <i className="sprite_icon headset"></i>
              <span className="count">{formatCount(itemData.playCount)}</span>
            </span>
            <button
              className="play sprite_icon play"
              onClick={() => handlePlayPlaylist()}
            ></button>
          </div>
        </div>
      </div>
      <div
        className="img-container"
        onClick={handleGoToDetail}
        style={{ cursor: 'pointer' }}
      >
        <div className="bottom">{itemData.name}</div>
      </div>
    </MenuItemWrapper>
  )
}

export default memo(SongMenuItem)
