import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import default_album from '@/assets/img/default_album.jpg'
import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Slider, message } from 'antd'
import {
  BarControl,
  BarOperator,
  BarPlayerInfo,
  PlayerBarWrapper
} from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { formatTime, getImageSize } from '@/utlis/format'
import { getSongPlayUrl } from '@/utlis/handle-player'
import ShareModel from '@/components/share-modal'
import {
  changeLyricIndexAction,
  changeMusicAction,
  changePlayModeAction,
  changePlayStatusAction
} from '../store/player'
import AppPlayerPanel from '../app-player-panel'

interface IProps {
  children?: ReactNode
}

const AppPlayerBar: FC<IProps> = () => {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [isSliding, setIsSliding] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const volumeRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { currentSong, lyrics, lyricIndex, playMode, playSongList, isPlaying } =
    useAppSelector((state) => ({
      currentSong: state.player.currentSong,
      lyrics: state.player.lyrics,
      lyricIndex: state.player.lyricIndex,
      playMode: state.player.playMode,
      playSongList: state.player.playSongList,
      isPlaying: state.player.isPlaying
    }))

  const dispatch = useAppDispatch()
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const handleOpenShare = useCallback(() => {
    setShareVisible(true)
  }, [])

  const handleCloseShare = useCallback(() => {
    setShareVisible(false)
  }, [])
  const shareConfig = {
    title: `${currentSong?.name || '未知歌曲'} - ${currentSong?.ar?.[0]?.name || '未知艺术家'}`,
    content: `我发现了一首很棒的歌曲《${currentSong?.name || '未知歌曲'}》-${currentSong?.ar?.[0]?.name || '未知艺术家'}，快来听听！`,
    url: window.location.href
  }
  // 点击外部关闭音量滑块
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        volumeRef.current &&
        !volumeRef.current.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    // 定义交互触发函数
    const handleUserInteraction = () => {
      setHasUserInteracted(true)
      // 监听一次后就移除，避免重复触发
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    // 绑定点击和触摸两种交互事件（覆盖PC和移动端）
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    // 组件卸载时清理事件（避免内存泄漏）
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [])

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (currentSong.url) {
        audioRef.current.src = currentSong.url
      } else {
        audioRef.current.src = getSongPlayUrl(currentSong.id)
      }
    }
    if (hasUserInteracted && audioRef.current) {
      audioRef.current
        ?.play()
        .then(() => {
          dispatch(changePlayStatusAction(true))
        })
        .catch(() => {
          dispatch(changePlayStatusAction(false))
        })
    }
    setDuration(currentSong.dt)
  }, [currentSong])

  function handleTimeUpdate() {
    let currentTime = 0
    if (audioRef.current) {
      currentTime = audioRef.current.currentTime * 1000
    }
    if (!isSliding) {
      const progress = (currentTime / duration) * 100
      setProgress(progress)
      setCurrentTime(currentTime)
    }
    let index = lyrics.length - 1
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i]
      if (currentTime < lyric.time) {
        index = i - 1
        break
      }
    }
    if (lyricIndex === index || index === -1) return
    dispatch(changeLyricIndexAction(index))
    message.open({
      content: lyrics[index].text,
      key: 'lyric',
      duration: 0,
      style: {
        // 增加样式确保可见
        position: 'fixed',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff'
      }
    })
  }

  function handleTimeEnded() {
    setProgress(0)
    setCurrentTime(0)
    if (playMode === 2) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
      audioRef.current?.play()
    } else {
      if (playSongList.length > 1) {
        handleChangeMusic(true)
      } else {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.pause()
        }
        dispatch(changePlayStatusAction(false))
      }
    }
  }

  function handleChangeMusic(isNext = true) {
    setProgress(0)
    setCurrentTime(0)
    dispatch(changeMusicAction(isNext))
  }

  function handlePlayBtnClick() {
    if (isPlaying) {
      audioRef.current?.pause()
      dispatch(changePlayStatusAction(false))
    } else {
      audioRef.current
        ?.play()
        .then(() => {
          dispatch(changePlayStatusAction(true))
        })
        .catch(() => {
          dispatch(changePlayStatusAction(false))
        })
    }
  }

  function handlePlayModeClick() {
    let newPlayMode = playMode + 1
    if (newPlayMode > 2) newPlayMode = 0
    dispatch(changePlayModeAction(newPlayMode))
  }

  function handleSliderChanged(value: number) {
    const currentTime = (value / 100) * duration
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime / 1000
    }
    setCurrentTime(currentTime)
    setProgress(value)
    setIsSliding(false)
  }

  function handleSliderChanging(value: number) {
    setIsSliding(true)
    setProgress(value)
    const currentTime = (value / 100) * duration
    setCurrentTime(currentTime)
  }

  function handleVolumeChange(value: number) {
    const newVolume = value / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      dispatch(changePlayStatusAction(true))
    }

    const handlePause = () => {
      dispatch(changePlayStatusAction(false))
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [dispatch])

  return (
    <PlayerBarWrapper className="sprite_playbar">
      <div className="content wrap-v2">
        <BarControl isPlaying={isPlaying}>
          <button
            className="btn sprite_playbar prev"
            onClick={() => handleChangeMusic(false)}
          ></button>
          <button
            className="btn sprite_playbar play"
            onClick={handlePlayBtnClick}
          ></button>
          <button
            className="btn sprite_playbar next"
            onClick={() => handleChangeMusic()}
          ></button>
        </BarControl>
        <BarPlayerInfo>
          {currentSong?.al?.picUrl ? (
            <Link to="/discover/player">
              <img
                className="image"
                src={
                  currentSong?.al?.picUrl
                    ? getImageSize(currentSong.al.picUrl, 50)
                    : default_album
                }
                alt=""
              />
            </Link>
          ) : (
            // 无真实封面 → 仅渲染默认图，无跳转
            <img
              className="image"
              src={default_album}
              alt="默认专辑封面" // 明确 alt 文本
            />
          )}
          <div className="info">
            <div className="song">
              <span className="song-name">{currentSong.name}</span>
              <span className="singer-name">{currentSong?.ar?.[0]?.name}</span>
              <div className="progress">
                <Slider
                  step={0.5}
                  value={progress}
                  tooltip={{ formatter: null }}
                  onChange={handleSliderChanging}
                  onAfterChange={handleSliderChanged}
                />
                <div className="time">
                  <span className="current">{formatTime(currentTime)}</span>
                  <span className="divider">/</span>
                  <span className="duration">
                    {duration ? formatTime(duration) : '00:00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BarPlayerInfo>
        <BarOperator playMode={playMode}>
          <div className="left">
            <button className="btn pip"></button>
            <button className="btn sprite_playbar favor"></button>
            <button
              className="btn sprite_playbar share"
              onClick={() => handleOpenShare()}
            ></button>
          </div>
          <div className="right sprite_playbar">
            <div className="volume-wrapper" ref={volumeRef}>
              <button
                className={`btn sprite_playbar volume ${volume === 0 ? 'muted' : ''}`}
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              ></button>
              {showVolumeSlider && (
                <div className="volume-slider-container">
                  <Slider
                    vertical
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />
                </div>
              )}
            </div>
            <button
              className="btn sprite_playbar loop"
              onClick={handlePlayModeClick}
            ></button>
            <button
              className="btn sprite_playbar playlist"
              onClick={() => setShowPanel(!showPanel)}
            >
              {playSongList.length}
            </button>
          </div>
        </BarOperator>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTimeEnded}
      />
      <AppPlayerPanel visible={showPanel} />
      <ShareModel
        visible={shareVisible}
        onClose={handleCloseShare}
        config={shareConfig}
      />
    </PlayerBarWrapper>
  )
}
export default memo(AppPlayerBar)
