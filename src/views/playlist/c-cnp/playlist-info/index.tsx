import React, { memo, useCallback, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { PlaylistInfoWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { formatMonthDay, getImageSize } from '@/utlis/format'
import ShareModel from '@/components/share-modal'
import { message } from 'antd'
import SongOperationBar from '@/components/song-operation-bar'
import {
  changePlaySongIndexAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
  onPlayClick?: () => void
}

const PlayListInfo: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const [isSpread, setIsSpread] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const { songsDetail } = useAppSelector((state) => state.song)
  const tracks = songsDetail?.tracks || []
  const playlistId = songsDetail?.id
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
  const handlePlayAll = useCallback(() => {
    if (tracks.length > 0) {
      dispatch(changePlaySongListAction(tracks))
      dispatch(changePlaySongIndexAction(0))
      dispatch(fetchCurrentSongAction(tracks[0].id))
    }
  }, [dispatch, tracks])
  const handleOpenShare = useCallback(() => {
    setShareVisible(true)
  }, [])

  const handleCloseShare = useCallback(() => {
    setShareVisible(false)
  }, [])

  const handleFavorClick = useCallback(() => {
    if (!songsDetail || !playlistId) {
      message.error('歌单信息异常，收藏失败！')
      return
    }
    const collectedList = JSON.parse(
      localStorage.getItem('collected_playlists') || '[]'
    )
    const isExisted = collectedList.some((item: any) => item.id === playlistId)
    if (isExisted) {
      const newList = collectedList.filter(
        (item: any) => item.id !== playlistId
      )
      localStorage.setItem('collected_playlists', JSON.stringify(newList))
      setIsCollected(false)
      message.success('已取消收藏')
    } else {
      collectedList.push(songsDetail)
      localStorage.setItem('collected_playlists', JSON.stringify(collectedList))
      setIsCollected(true)
      message.success('歌单收藏成功！')
    }
  }, [songsDetail, playlistId])

  useEffect(() => {
    if (!playlistId) return
    const collectedList = JSON.parse(
      localStorage.getItem('collected_playlists') || '[]'
    )
    const isExisted = collectedList.some((item: any) => item.id === playlistId)
    setIsCollected(isExisted)
  }, [playlistId])

  const shareConfig = {
    title: songsDetail?.name || '歌单分享',
    content: `我发现了一个很棒的歌单：${songsDetail?.name || ''}，快来听听！`,
    url: window.location.href
  }

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
          favorTitle={isCollected ? '已收藏' : '收藏'}
          shareTitle="分享"
          downloadTitle="下载"
          onPlayClick={handlePlayAll}
          onShareClick={handleOpenShare}
          onFavorClick={handleFavorClick}
        />
        <ShareModel
          visible={shareVisible}
          onClose={handleCloseShare}
          config={shareConfig}
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
