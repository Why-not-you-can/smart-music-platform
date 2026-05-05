import React, { memo, useCallback, useEffect, useState } from 'react'
import type { FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { SearchListWrapper } from './style'
import { fetchSongForSearchAction } from '../../store/search'
import hyRequest from '@/service'
import { formatFavCount, formatTime, getImageSize } from '@/utlis/format'
import IPagination from '@/components/pagination'
import ShareModel from '@/components/share-modal'
import { ShareConfig } from '@/components/share-modal'
import { fetchSongsDetailAction } from '@/views/discover/c-views/songs/store/song'
import {
  changePlaySongIndexAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'
import { getSongPlayUrl } from '@/utlis/handle-player'

// TS 类型定义
interface ISong {
  id: number
  name: string
  album: { name: string }
  artists: Array<{ name: string }>
  duration: number
}
interface IAllData {
  song: ISong[]
  artist: any[]
  album: any[]
  video: any[]
  songs: any[]
  lyric: any[]
  anchor: any[]
  user: any[]
}

type TabType =
  | 'song'
  | 'artist'
  | 'album'
  | 'video'
  | 'lyric'
  | 'songs'
  | 'anchor'
  | 'user'

const REQUEST_PAGES = 4

const SearchList: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords') || ''
  const [activeTab, setActiveTab] = useState<TabType>('song')
  const [loading, setLoading] = useState(false)
  const songsDetail = useAppSelector((state) => state.song.songsDetail)
  const [currentPage, setCurrentPage] = useState(1)
  const [shareVisible, setShareVisible] = useState(false)
  const [currentShareConfig, setCurrentShareConfig] = useState<
    ShareConfig | undefined
  >(undefined)
  const pageSize = activeTab === 'artist' ? 90 : 30
  const [allData, setAllData] = useState<IAllData>({
    song: [],
    artist: [],
    album: [],
    video: [],
    lyric: [],
    songs: [],
    anchor: [],
    user: []
  })
  const countMap = {
    song: allData.song.length,
    artist: allData.artist.length,
    album: allData.album.length,
    video: allData.video.length,
    lyric: allData.lyric.length,
    songs: allData.songs.length,
    anchor: allData.anchor.length,
    user: allData.user.length
  }

  const total = keywords ? countMap[activeTab] : 0
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return allData[activeTab].slice(start, end)
  }

  const highlightKeyword = (text: string) => {
    if (!keywords.trim()) return text
    const regex = new RegExp(`(${keywords})`, 'gi')
    return text.split(regex).map((item, index) =>
      regex.test(item) ? (
        <span key={index} className="highlight">
          {item}
        </span>
      ) : (
        item
      )
    )
  }

  const typeConfig = [
    { key: 'song', type: 1, resField: 'songs' },
    { key: 'artist', type: 100, resField: 'artists' },
    { key: 'album', type: 10, resField: 'albums' },
    { key: 'video', type: 1014, resField: 'videos' },
    { key: 'lyric', type: 1009, resField: 'lyrics' },
    { key: 'songs', type: 1000, resField: 'playlists' },
    { key: 'anchor', type: 2000, resField: 'djRadios' },
    { key: 'user', type: 1002, resField: 'users' }
  ]
  useEffect(() => {
    if (!keywords) return
    setLoading(true)
    const fetchAllData = async () => {
      const promises = typeConfig.map(async (item) => {
        const pagePromises = Array.from({ length: REQUEST_PAGES }, (_, i) =>
          hyRequest.get({
            url: '/search',
            params: {
              keywords,
              type: item.type,
              limit: 100,
              offset: i * 100
            }
          })
        )
        const pageResults = await Promise.all(pagePromises)
        return pageResults.flatMap((res) => res.result?.[item.resField] || [])
      })

      const resList = await Promise.all(promises)
      const results: IAllData = {
        song: [],
        artist: [],
        album: [],
        video: [],
        lyric: [],
        songs: [],
        anchor: [],
        user: []
      }
      resList.forEach((data, index) => {
        const key = typeConfig[index].key as keyof IAllData
        results[key] = data
      })

      setAllData(results)
      setLoading(false)
    }

    fetchAllData()
  }, [keywords])

  if (!keywords) return null
  const handlePlayClick = (id: number) => {
    dispatch(fetchSongForSearchAction(id))
  }
  const handlePlayPlaylist = async (playlistId: number) => {
    await dispatch(fetchSongsDetailAction(playlistId))
    const songList = songsDetail?.tracks ?? []
    if (songList.length === 0) return
    dispatch(changePlaySongListAction(songList))
    dispatch(changePlaySongIndexAction(0))
    dispatch(fetchCurrentSongAction(songList[0].id))
  }
  const handleDownload = (songItem: any) => {
    const musicUrl = getSongPlayUrl(songItem.id)
    const singer = songItem.artists?.map((a) => a.name).join(',') || '未知歌手'
    const fileName = `${songItem.name || '未知歌曲'} - ${singer}.mp3`

    const a = document.createElement('a')
    a.href = musicUrl
    a.download = fileName
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  const handleOpenShare = useCallback(
    (item: any, type: 'song' | 'playlist') => {
      if (type === 'song') {
        setCurrentShareConfig({
          title: `${item.name || '未知歌曲'} - ${item.artists?.[0]?.name || '未知艺术家'}`,
          content: `我发现了一首很棒的歌曲《${item.name || '未知歌曲'}》-${item.artists?.[0]?.name || '未知艺术家'}，快来听听！`,
          url: window.location.href
        })
      } else {
        setCurrentShareConfig({
          title: item.name || '歌单分享',
          content: `我发现了一个很棒的歌单：${item.name || ''}，快来听听！`,
          url: window.location.href
        })
      }
      setShareVisible(true)
    },
    []
  )
  const handleCloseShare = useCallback(() => {
    setShareVisible(false)
  }, [])
  const currentSongList = activeTab === 'song' ? getCurrentPageData() : []
  return (
    <SearchListWrapper>
      <div className="search-stats">
        搜索“<span className="keyword">{keywords}</span>”，找到
        <span className="count">{countMap[activeTab]}</span>
        {activeTab === 'song' && '首单曲'}
        {activeTab === 'artist' && '位歌手'}
        {activeTab === 'album' && '张专辑'}
        {activeTab === 'video' && '个视频'}
        {activeTab === 'lyric' && '个歌词'}
        {activeTab === 'songs' && '个歌单'}
        {activeTab === 'anchor' && '个主播'}
        {activeTab === 'user' && '个用户'}
      </div>
      <div className="tab-bar tab">
        <div
          className={`tab-btn ${activeTab === 'song' ? 'active' : ''}`}
          onClick={() => setActiveTab('song')}
        >
          单曲
        </div>
        <div
          className={`tab-btn ${activeTab === 'artist' ? 'active' : ''}`}
          onClick={() => setActiveTab('artist')}
        >
          歌手
        </div>
        <div
          className={`tab-btn ${activeTab === 'album' ? 'active' : ''}`}
          onClick={() => setActiveTab('album')}
        >
          专辑
        </div>
        <div
          className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
          onClick={() => setActiveTab('video')}
        >
          视频
        </div>
        <div
          className={`tab-btn ${activeTab === 'songs' ? 'active' : ''}`}
          onClick={() => setActiveTab('songs')}
        >
          歌单
        </div>
        <div
          className={`tab-btn ${activeTab === 'lyric' ? 'active' : ''}`}
          onClick={() => setActiveTab('lyric')}
        >
          歌词
        </div>
        <div
          className={`tab-btn ${activeTab === 'anchor' ? 'active' : ''}`}
          onClick={() => setActiveTab('anchor')}
        >
          主播
        </div>
        <div
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          用户
        </div>
      </div>

      <div className="content-list">
        {loading && <div className="empty">加载中...</div>}
        {activeTab === 'song' && !loading && (
          <div className="play-list">
            <table>
              <tbody>
                {currentSongList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      暂无歌曲
                    </td>
                  </tr>
                ) : (
                  currentSongList.map((item: any) => (
                    <tr key={item.id} className="song-item">
                      <td className="play-col">
                        <button
                          className="play sprite_table"
                          title="播放"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayClick(item.id)
                          }}
                        ></button>
                      </td>
                      <td className="title-col">
                        <div className="song-name-box">
                          <span
                            className="song-title"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate('/discover/player')
                            }}
                          >
                            {highlightKeyword(item.name)}
                          </span>
                          <div className="operate-btns">
                            <button
                              className="add sprite_icon2"
                              title="添加"
                              onClick={(e) => e.stopPropagation()}
                            ></button>
                            <button
                              className="fav sprite_table"
                              title="收藏"
                              onClick={(e) => e.stopPropagation()}
                            ></button>
                            <button
                              className="share sprite_table"
                              title="分享"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenShare(item, 'song')
                              }}
                            ></button>
                            <button
                              className="download sprite_table"
                              title="下载"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(item)
                              }}
                            ></button>
                          </div>
                        </div>
                      </td>
                      <td className="artist-col">
                        {highlightKeyword(
                          item.artists.map((a) => a.name).join('/')
                        )}
                      </td>
                      <td className="album-col">
                        {highlightKeyword(
                          item.album?.name ? `《${item.album.name}》` : ''
                        )}
                      </td>
                      <td className="time-col">{formatTime(item.duration)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'artist' && !loading && (
          <div className="artist-list">
            {getCurrentPageData().map((item: any, index: number) => (
              <div key={`${item.id}-${index}`} className="artist-item">
                <div className="artist-img">
                  <img
                    src={getImageSize(item.picUrl || item.avatar, 130, 130)}
                    alt={item.name}
                  />
                  <div className="cover sprite_cover"></div>
                </div>
                <div className="artist-info">
                  <div className="artist-name">
                    {highlightKeyword(item.name)}
                  </div>
                  <i className="sprite_icon2 icon"></i>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'album' && !loading && (
          <div className="album-list">
            {getCurrentPageData().map((item: any, index: number) => (
              <div key={`${item.id}-${index}`} className="album-item">
                <div className="album-img">
                  <img
                    src={getImageSize(item.picUrl, 130, 130)}
                    alt={item.name}
                  />
                  <div className="album-cover sprite_cover"></div>
                </div>
                <div className="album-name">{highlightKeyword(item.name)}</div>
                <div className="artist-name">
                  {highlightKeyword(
                    item.artistName || item.artists?.[0]?.name || ''
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'video' && !loading && (
          <div className="video-list">
            {getCurrentPageData().map((item: any) => {
              return (
                <div key={item.vid} className="video-item">
                  <div className="video-img">
                    <img
                      src={getImageSize(item.coverUrl, 159, 90)}
                      alt={item.title}
                    />
                    <p className="mask tl">
                      <span className="sprite_icon3 mv"></span>
                      {item.playTime}
                    </p>
                    <p className="bl">{formatTime(item.durationms)}</p>
                  </div>
                  <div className="video-info">
                    <i className="sprite_icon3 vic"></i>
                    <div className="video-title">
                      {highlightKeyword(item.title)}
                    </div>
                  </div>
                  <div className="video-name">
                    {highlightKeyword(item.creator?.[0]?.userName || '')}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {activeTab === 'songs' && !loading && (
          <div className="play-list songs-list">
            <table>
              <tbody>
                {getCurrentPageData().length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      暂无歌单
                    </td>
                  </tr>
                ) : (
                  getCurrentPageData().map((item: any) => {
                    return (
                      <tr key={item.id} className="song-item">
                        <td className="play-col">
                          <button
                            className="play sprite_table"
                            title="播放歌单"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePlayPlaylist(item.id)
                            }}
                          ></button>
                        </td>
                        <td className="w7">
                          <img
                            src={getImageSize(item.coverImgUrl, 200, 200)}
                            alt={item.name}
                            style={{ width: 50, height: 50, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              dispatch(fetchSongsDetailAction(item.id))
                              navigate(`/discover/playlist?id=${item.id}`)
                            }}
                          />
                        </td>
                        <td className="title-col">
                          <div className="song-name-box">
                            <span className="song-title">
                              {highlightKeyword(item.name)}
                            </span>
                            <div className="operate-btns">
                              <button
                                className="add sprite_icon2"
                                title="添加"
                                onClick={(e) => e.stopPropagation()}
                              ></button>
                              <button
                                className="fav sprite_table"
                                title="收藏"
                                onClick={(e) => e.stopPropagation()}
                              ></button>
                              <button
                                className="share sprite_table"
                                title="分享"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenShare(item, 'playlist')
                                }}
                              ></button>
                            </div>
                          </div>
                        </td>
                        <td className="songs-count">
                          {item.trackCount || 0}首
                        </td>
                        <td className="w4">
                          <div className="text">
                            <span className="text_1">by</span>
                            &nbsp;&nbsp;
                            <span className="text_2">
                              {item.creator?.nickname || ''}
                            </span>
                          </div>
                        </td>
                        <td className="fav-col">
                          收藏：{formatFavCount(item.bookCount)}
                        </td>
                        <td className="time-col">
                          收听：
                          {formatFavCount(
                            item.playCount || item.playcount || 0
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
        {!loading && countMap[activeTab] === 0 && (
          <div className="empty">暂无数据</div>
        )}
      </div>
      <div className="pagination-container">
        <IPagination
          currentPage={currentPage}
          total={total}
          onPageChange={handlePageChange}
          pageSize={pageSize}
        />
      </div>
      <ShareModel
        visible={shareVisible}
        onClose={handleCloseShare}
        config={currentShareConfig}
      />
    </SearchListWrapper>
  )
}

export default memo(SearchList)
