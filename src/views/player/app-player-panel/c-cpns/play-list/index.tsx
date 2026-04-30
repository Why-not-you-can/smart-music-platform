import { useAppDispatch, useAppSelector } from '@/store'
import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayListWrapper } from './style'
import { formatTime } from '@/utlis/format'
import ShareModel, { ShareConfig } from '@/components/share-modal'
import { fetchCurrentSongAction } from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
}

const PlayList: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { playSongList, playSongIndex } = useAppSelector(
    (state) => state.player
  )
  const [shareVisible, setShareVisible] = useState(false)
  const [shareConfig, setShareConfig] = useState<ShareConfig | undefined>()
  const handleSongClick = (id: number) => {
    dispatch(fetchCurrentSongAction(id))
  }
  const handleShareIconClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()

    const songName = item.name || item.title || '未知歌曲'
    const artistName = item.ar?.[0]?.name || item.artist || '未知艺术家'

    setShareConfig({
      title: `${songName} - ${artistName}`,
      content: `分享一首好听的歌曲《${songName}》- ${artistName}`,
      url: window.location.href
    })
    setShareVisible(true)
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
                <span
                  className="sprite_playlist link"
                  onClick={(e) => handleShareIconClick(e, item)}
                ></span>
              </div>
            </div>
          )
        })}
      </div>
      <ShareModel
        visible={shareVisible}
        config={shareConfig}
        onClose={() => setShareVisible(false)}
      />
    </PlayListWrapper>
  )
}

export default memo(PlayList)
