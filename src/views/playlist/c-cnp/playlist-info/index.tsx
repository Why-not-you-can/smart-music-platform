import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { PlaylistInfoWrapper } from './style'
import { useAppSelector } from '@/store'
import { formatMonthDay, getImageSize } from '@/utlis/format'
import SongOperationBar from '@/components/song-operation-bar'

interface IProps {
  children?: ReactNode
}

const PlayListInfo: FC<IProps> = () => {
  const [isSpread, setIsSpread] = useState(false)
  const { songsDetail } = useAppSelector((state) => state.song)
  const {
    coverImgUrl,
    highQuality = false,
    name = '',
    creator = {},
    createTime = 0,
    tags = [],
    description = ''
  } = songsDetail || {}
  const creatorAvatar = creator?.avatarUrl
  const creatorName = creator?.nickname || '未知创作者'
  const descLines = description
    ? description.split('\n').filter((line) => line.trim())
    : []
  const displayLines = isSpread ? descLines : descLines.slice(0, 3)

  return (
    <PlaylistInfoWrapper>
      <div className="left">
        <div className="image">
          <img
            src={coverImgUrl ? getImageSize(coverImgUrl, 200) : ''}
            alt={name || '歌单封面'}
          />
          {highQuality && <div className="quality-tag ">精品</div>}
          <span className="cover sprite_cover"></span>
        </div>
      </div>

      <div className="right" data-is-Spread={isSpread}>
        <div className="header">
          <i className="sprite_icon2"></i>
          <h1 className="playlist-title">{name}</h1>
        </div>
        <div className="creator-info">
          <img
            src={creatorAvatar ? getImageSize(creatorAvatar, 40) : ''}
            alt={creatorName || '创作者头像'}
            className="creator-avatar"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                'https://via.placeholder.com/40?text=用户'
            }}
          />
          <span className="creator-nickname">{creatorName}</span>
          <span className="create-time">
            创建于 {formatMonthDay(createTime)}
          </span>
        </div>

        <SongOperationBar
          favorTitle="收藏"
          shareTitle="分享"
          downloadTitle="下载"
        />

        <div className="info-tags">
          <span className="tags-label">标签：</span>
          <div className="tags-list">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="tag-item">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="info-description">
          <h3 className="desc-title">介绍:</h3>
          <div className="desc-content">
            {displayLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          {descLines.length > 3 && (
            <button
              className="desc-control"
              onClick={() => setIsSpread(!isSpread)}
            >
              {isSpread ? '收起' : '展开'}
              <i className="sprite_icon2"></i>
            </button>
          )}
        </div>
      </div>
    </PlaylistInfoWrapper>
  )
}

export default memo(PlayListInfo)
