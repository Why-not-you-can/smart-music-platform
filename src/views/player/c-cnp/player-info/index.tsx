import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayerInfoWrapper } from './style'
import { useAppSelector } from '@/store'
import { getImageSize } from '@/utlis/format'
import SongOperationBar from '@/components/song-operation-bar'

interface IProps {
  children?: ReactNode
}

const PlayerInfo: FC<IProps> = () => {
  const [isSpread, setIsSpread] = useState(false)
  const { currentSong, lyrics } = useAppSelector((state) => ({
    currentSong: state.player.currentSong,
    lyrics: state.player.lyrics
  }))
  const totalLyricCount = isSpread ? lyrics.length : 13
  return (
    <PlayerInfoWrapper>
      <div className="left">
        <div className="image sprite_cover">
          <img
            src={getImageSize(currentSong?.al?.picUrl, 130)}
            alt="歌曲封面"
          />
          <span className="cover sprite_cover"></span>
        </div>
        <span className="cover sprite_cover"></span>
        <div className="link">
          <i className="sprite_icon2"></i>
          <a href="#/">生成外联播放器</a>
        </div>
      </div>
      <div className="right" data-is-Spread={isSpread}>
        <div className="header">
          <i className="sprite_icon2"></i>
          <h3 className="title">{currentSong?.name}</h3>
        </div>
        <div className="singer">
          <span className="label">歌手：</span>
          <a href="/#" className="name">
            {currentSong?.ar?.[0]?.name}
          </a>
        </div>
        <div className="album">
          <span className="label">所属专辑：</span>
          <a href="/#" className="name">
            {currentSong?.al?.name}
          </a>
        </div>
        <SongOperationBar
          favorTitle="收藏"
          shareTitle="分享"
          downloadTitle="下载"
        />
        <div className="lyric">
          <div className="lyric-info">
            {lyrics.slice(0, totalLyricCount).map((item, index) => {
              return (
                <p key={`${item.time}-${index}`} className="text">
                  {item.text}
                </p>
              )
            })}
          </div>
          <button
            className="lyric-control"
            onClick={() => setIsSpread(!isSpread)}
          >
            {isSpread ? '收起' : '展开'}
            <i className="sprite_icon2"></i>
          </button>
        </div>
      </div>
    </PlayerInfoWrapper>
  )
}

export default memo(PlayerInfo)
