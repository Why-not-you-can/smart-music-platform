import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayerRelevantWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import ThemeHeaderPlayer from '@/components/theme-header-player'
import {
  fetchCurrentSongAction,
  fetchSimiSongsAction
} from '../../store/player'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const PlayerRelevant: FC<IProps> = () => {
  const { simiSongs, currentSong } = useAppSelector((state) => ({
    simiSongs: state.player.simiSongs,
    currentSong: state.player.currentSong
  }))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (currentSong?.id) {
      dispatch(fetchSimiSongsAction())
    }
  }, [dispatch, currentSong?.id])

  function handlePlayClick(id: number) {
    dispatch(fetchCurrentSongAction(id))
  }

  const handleSongClick = async (id: number) => {
    await dispatch(fetchCurrentSongAction(id)).unwrap()
    navigate('/discover/player')
  }

  return (
    <PlayerRelevantWrapper>
      <ThemeHeaderPlayer title="相似歌曲" />
      <div className="songs">
        {simiSongs?.map((item, index) => {
          return (
            <div className="song-item" key={`${item.id}-${index}`}>
              <div className="info">
                <div
                  className="title"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSongClick(item.id)}
                >
                  <a>{item.name}</a>
                </div>
                <div className="artist">
                  <a>{item.artists[0].name}</a>
                </div>
              </div>
              <div className="operate">
                <button
                  className="item sprite_icon3 play"
                  onClick={() => handlePlayClick(item.id)}
                ></button>
                <button className="item sprite_icon3 add"></button>
              </div>
            </div>
          )
        })}
      </div>
    </PlayerRelevantWrapper>
  )
}

export default memo(PlayerRelevant)
