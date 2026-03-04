import { useAppDispatch, useAppSelector } from '@/store'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayListWrapper } from './style'
import { formatTime } from '@/utlis/format'
import { fetchCurrentSongAction } from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
}

const PlayList: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { playSongList, playSongIndex } = useAppSelector(
    (state) => state.player
  )

  const handleSongClick = (id: number) => {
    dispatch(fetchCurrentSongAction(id))
  }

  return (
    <PlayListWrapper>
      <div className="scroll-container">
        {playSongList.map((item, index) => {
          if (!item) return null
          const artistName = item.ar?.[0]?.name || item.artist || '未知艺术家'
          const duration = item.dt || item.duration || 0
          const songName = item.name || item.title || '未知歌曲'
          return (
            <div
              key={item.id}
              className={`play-item ${playSongIndex === index ? 'active' : ''}`}
              onClick={() => handleSongClick(item.id)}
            >
              <div className="left">{songName}</div>
              <div className="right">
                <span className="singer">{artistName}</span>
                <span className="duration">{formatTime(duration)}</span>
                <span className="sprite_playlist link"></span>
              </div>
            </div>
          )
        })}
      </div>
    </PlayListWrapper>
  )
}

export default memo(PlayList)
