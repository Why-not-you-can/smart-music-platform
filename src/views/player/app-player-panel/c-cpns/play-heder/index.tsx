import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayHeaderWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearPlayListAction } from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
}

const PlayHeader: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { playSongList, currentSong } = useAppSelector((state) => ({
    playSongList: state.player.playSongList,
    currentSong: state.player.currentSong
  }))

  const handleClearPlayList = () => {
    dispatch(clearPlayListAction())
  }

  return (
    <PlayHeaderWrapper>
      <div className="left">
        <h3>播放列表({playSongList.length})</h3>
        <div className="operator">
          <button>
            <i className="sprite_playlist icon favor"></i>
            收藏全部
          </button>
          <button className="clear-btn" onClick={handleClearPlayList}>
            <i className="sprite_playlist icon remove"></i>
            <span className="clear-text">清除</span>
          </button>
        </div>
      </div>
      <div className="right">{currentSong?.name}</div>
    </PlayHeaderWrapper>
  )
}

export default memo(PlayHeader)
