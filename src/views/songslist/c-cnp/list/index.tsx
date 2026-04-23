import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { ListWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSongsListAction } from '../../store/songslist'

import { formatTime } from '@/utlis/format'
import { Pagination } from 'antd'
import {
  changeCurrentSongAction,
  changePlaySongIndexAction,
  changePlayStatusAction
} from '@/views/player/store/player'

interface IProps {
  children?: ReactNode
}

const List: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const songs = useAppSelector((state) => state.songslist.songs)
  const { playSongList } = useAppSelector((state) => state.player)
  const total = songs?.total || 0
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 35
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }
  useEffect(() => {
    dispatch(fetchSongsListAction())
  }, [dispatch])
  const tracks = songs?.tracks || []
  const handlePlayClick = (item: any) => {
    dispatch(changeCurrentSongAction(item))
    const index = playSongList.findIndex((s) => s.id === item.id)
    dispatch(changePlaySongIndexAction(index === -1 ? 0 : index))
    dispatch(changePlayStatusAction(true))
  }
  return (
    <ListWrapper>
      <div className="play-list">
        <table>
          <thead>
            <tr className="header">
              <th className="ranking"></th>
              <th className="title">歌曲标题</th>
              <th className="duration">时长</th>
              <th className="creator">创作者</th>
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
                        onClick={() => handlePlayClick(item)}
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
                  <td className="creator">
                    {item.ur?.map((artist: any) => artist.name).join('/') ||
                      '未知创作者'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </ListWrapper>
  )
}

export default memo(List)
