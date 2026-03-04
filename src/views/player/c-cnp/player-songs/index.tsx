import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayerSongsWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSimiPlayListAction } from '../../store/player'
import ThemeHeaderPlayer from '@/components/theme-header-player'
import { getImageSize } from '@/utlis/format'
import { fetchSongsDetailAction } from '@/views/discover/c-views/songs/store/song'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const PlayerSongs: FC<IProps> = () => {
  const { simiPlaylist, currentSong } = useAppSelector((state) => ({
    simiPlaylist: state.player.simiPlaylist,
    currentSong: state.player.currentSong
  }))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (currentSong?.id) {
      dispatch(fetchSimiPlayListAction())
    }
  }, [dispatch, currentSong?.id])

  const handleSongClick = async (id: number) => {
    await dispatch(fetchSongsDetailAction(id)).unwrap()
    navigate(`/discover/playlist`)
  }
  return (
    <PlayerSongsWrapper>
      <ThemeHeaderPlayer title="包含这首歌的歌单" />
      <div className="songs">
        {simiPlaylist?.map((item, index) => {
          return (
            <div className="song-item" key={`${item.id}-${index}`}>
              <img
                className="image"
                src={getImageSize(item.coverImgUrl, 50)}
                alt=""
              />
              <div
                className="info text-nowrap"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSongClick(item.id)}
              >
                <a className="name">{item.name}</a>
                <div className="auchor">
                  by
                  <a className="nickname">{item.creator.nickname}</a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </PlayerSongsWrapper>
  )
}

export default memo(PlayerSongs)
