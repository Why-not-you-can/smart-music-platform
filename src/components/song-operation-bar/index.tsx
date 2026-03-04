import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { OperationBarWrapper } from './style'
import {
  changePlayModeAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'
import { useAppDispatch, useAppSelector } from '@/store'

interface IProps {
  children?: ReactNode
  favorTitle: any
  shareTitle: any
  downloadTitle: any
}

const OperationBar: FC<IProps> = (props) => {
  const { favorTitle, shareTitle, downloadTitle } = props
  const dispatch = useAppDispatch()
  const { topDetail } = useAppSelector((state) => state.ranking)
  const handlePlayAll = () => {
    const songList = topDetail?.tracks || [] // 假设歌曲列表在topDetail.tracks中
    if (songList.length > 0) {
      dispatch(changePlaySongListAction(songList))
      dispatch(fetchCurrentSongAction(songList[0].id))
      dispatch(changePlayModeAction(0))
    }
  }
  return (
    <OperationBarWrapper>
      <span className="play">
        <button className="play-icon sprite_button" onClick={handlePlayAll}>
          <span className="play sprite_button">
            <i className="sprite_button"></i>
            <span>播放</span>
          </span>
        </button>
        <a href="/abc" className="add-icon sprite_button">
          +
        </a>
      </span>
      <a href="/abc" className="item sprite_button">
        <i className="icon favor-icon sprite_button">{favorTitle}</i>
      </a>
      <a href="/abc" className="item sprite_button">
        <i className="icon share-icon sprite_button">{shareTitle}</i>
      </a>
      <a href="/abc" className="item sprite_button">
        <i className="icon download-icon sprite_button">{downloadTitle}</i>
      </a>
    </OperationBarWrapper>
  )
}

export default memo(OperationBar)
