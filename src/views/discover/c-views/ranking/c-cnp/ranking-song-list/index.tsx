import React, { memo } from 'react'
import type { FC } from 'react'
import { SongListWrapper } from './style'
import { useRankSelect } from '@/components/useRankSelect'
import { formatTime, getImageSize } from '@/utlis/format'
import { fetchCurrentSongAction } from '@/views/player/store/player'
import { useAppDispatch } from '@/store'

const SongList: FC = () => {
  const dispatch = useAppDispatch()
  const selectedRank = useRankSelect()

  if (!selectedRank) {
    return (
      <SongListWrapper>
        <div className="play-list">加载中...</div>
      </SongListWrapper>
    )
  }
  const tracks = selectedRank.tracks || selectedRank.songs || []
  function handlePlayClick(id: number) {
    dispatch(fetchCurrentSongAction(id))
  }
  return (
    <SongListWrapper>
      <div className="header-info">
        <h3 className="list-title">歌曲列表</h3>
        <span className="list-song">{tracks.length}首歌</span>

        {selectedRank.playCount && (
          <div className="play-stats s-fc3">
            播放：
            <strong className="s-fc6" id="play-count">
              {selectedRank.playCount}
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
              <th className="title">标题</th>
              <th className="duration">时长</th>
              <th className="singer">歌手</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  暂无歌曲数据
                </td>
              </tr>
            ) : (
              tracks.map((item, index) => (
                <tr key={item.id || index}>
                  <td>
                    <div className="rank-num">
                      <span className="num">{index + 1}</span>
                      <span className="new sprite_icon2"></span>
                    </div>
                  </td>
                  <td>
                    <div className="song-name">
                      {index < 3 && item.al?.picUrl && (
                        <img
                          src={getImageSize(item.al.picUrl, 50)}
                          alt={item.name || '歌曲封面'}
                          style={{ display: 'inline-block' }}
                        />
                      )}
                      <button
                        className="play sprite_table"
                        onClick={() => handlePlayClick(item.id)}
                      ></button>
                      <span className="name">{item.name || '未知歌曲'}</span>
                    </div>
                  </td>
                  <td>{item.dt ? formatTime(item.dt) : '00:00'}</td>
                  <td>{item.ar?.[0]?.name || '未知歌手'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SongListWrapper>
  )
}

export default memo(SongList)
