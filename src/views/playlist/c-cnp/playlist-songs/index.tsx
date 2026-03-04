import React, { memo, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useParams } from 'react-router-dom'
import { formatTime } from '@/utlis/format'
import { fetchSongsDetailAction } from '@/views/discover/c-views/songs/store/song'
import { PlayListSongsWrapper } from './style'
import { fetchCurrentSongAction } from '@/views/player/store/player'

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { songsDetail } = useAppSelector((state) => state.song)

  const tracks = songsDetail?.tracks || []
  const playCount = songsDetail?.playCount || 0

  useEffect(() => {
    if (id) {
      dispatch(fetchSongsDetailAction(Number(id)))
    }
  }, [dispatch, id])

  if (!songsDetail) {
    return (
      <PlayListSongsWrapper>
        <div className="play-list">加载中...</div>
      </PlayListSongsWrapper>
    )
  }
  function handlePlayClick(id: number) {
    dispatch(fetchCurrentSongAction(id))
  }
  return (
    <PlayListSongsWrapper>
      <div className="header-info">
        <h3 className="list-title">歌曲列表</h3>
        <span className="list-song">{tracks.length}首歌</span>

        {playCount > 0 && (
          <div className="play-stats s-fc3">
            播放：
            <strong className="s-fc6" id="play-count">
              {playCount}
            </strong>
            次
          </div>
        )}
      </div>
      <div className="play-list">
        <table>
          <thead>
            <tr className="header">
              <th className="ranking"></th>
              <th className="title">歌曲标题</th>
              <th className="duration">时长</th>
              <th className="singer">歌手</th>
              <th className="album">专辑</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  暂无歌曲数据
                </td>
              </tr>
            ) : (
              tracks.map((item: any, index: number) => (
                <tr key={item.id} className="song-item">
                  <td>
                    <div className="rank-num">
                      <span className="num">{index + 1}</span>
                      <button
                        className="play sprite_table"
                        onClick={() => handlePlayClick(item.id)}
                        title="播放"
                      ></button>
                    </div>
                  </td>
                  <td>
                    <div className="song-name">
                      <span className="name">{item.name || '未知歌曲'}</span>
                    </div>
                  </td>
                  <td className="duration">
                    {item.dt ? formatTime(item.dt) : '00:00'}
                  </td>
                  <td className="singer">
                    {item.ar?.map((artist: any) => artist.name).join('/') ||
                      '未知歌手'}
                  </td>
                  <td className="album">{item.al?.name || '未知专辑'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PlayListSongsWrapper>
  )
}

export default memo(PlaylistDetail)
