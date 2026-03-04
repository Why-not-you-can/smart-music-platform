import React, { memo, useEffect, useMemo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { SongsListWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchSongListAction, fetchSongsDetailAction } from '../../store/song'
import { formatCount, getImageSize } from '@/utlis/format'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination } from 'antd'
import {
  changePlaySongIndexAction,
  changePlaySongListAction,
  fetchCurrentSongAction
} from '@/views/player/store/player'
interface IProps {
  children?: ReactNode
}
const SongsList: FC<IProps> = () => {
  const [actionType, setActionType] = useState<'play' | 'navigate' | null>(null)
  const { categorySongs, songsDetail } = useAppSelector((state) => state.song)
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 35

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchSongListAction(currentPage - 1))
  }, [dispatch, currentPage])

  useEffect(() => {
    if (
      actionType === 'play' &&
      songsDetail?.tracks &&
      songsDetail.tracks.length > 0
    ) {
      dispatch(changePlaySongListAction(songsDetail.tracks))
      dispatch(changePlaySongIndexAction(0))
      dispatch(fetchCurrentSongAction(songsDetail.tracks[0].id))
    }
    setActionType(null)
  }, [songsDetail, dispatch])

  const songData = categorySongs as any
  const playlists = songData?.playlists || []
  const total = songData?.total || 0

  const topFavoriteId = useMemo(() => {
    if (playlists.length === 0) return null

    return playlists.reduce((maxId: number | null, item: any) => {
      const currentFav = item?.bookCount || 0
      const maxFav = playlists.find((i: any) => i.id === maxId)?.bookCount || 0

      return currentFav > maxFav ? item.id : maxId
    }, playlists[0].id)
  }, [playlists])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handlePlayPlaylist = (playlistId: number) => {
    setActionType('play')
    dispatch(fetchSongsDetailAction(playlistId))
  }

  const handleGoToPlaylistDetail = async (playlistId: number) => {
    setActionType('navigate')
    await dispatch(fetchSongsDetailAction(playlistId)).unwrap()
    navigate(`/discover/playlist`)
  }

  return (
    <SongsListWrapper>
      <div className="song-list">
        {playlists.map((item) => (
          <div key={item?.id} className="song-item">
            <div className="top">
              <div
                className="img-container"
                onClick={() => handleGoToPlaylistDetail(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={getImageSize(item?.coverImgUrl, 140)}
                  alt={item?.name}
                />
                {item.id === topFavoriteId && (
                  <span className="top-favorite-marker sprite_icon3"></span>
                )}
              </div>
              <div className="cover sprite_cover">
                <div className="info sprite_cover">
                  <span>
                    <i className="sprite_icon2"></i>
                    <span className="count">
                      {formatCount(item?.playCount || 0)}
                    </span>
                  </span>
                  <button
                    className="play sprite_icon play"
                    onClick={() => handlePlayPlaylist(item.id)}
                  ></button>
                </div>
              </div>
            </div>
            <div className="bottom">
              <div
                className="song-name"
                title={item?.name}
                onClick={() => handleGoToPlaylistDetail(item.id)}
              >
                {item?.name}
              </div>
              <p className="song-creator" title={item?.creator?.nickname}>
                <span className="by-text">by </span>
                <Link
                  to={`/user/home?id=${item?.creator?.userId}`}
                  className="creator-name"
                  title={item?.creator?.nickname}
                >
                  {item?.creator?.nickname}
                </Link>
                {item?.creator?.avatarDetail?.identityIconUrl && (
                  <img
                    src={item?.creator?.avatarDetail?.identityIconUrl}
                    alt="认证标识"
                    className="verify-icon"
                  />
                )}
              </p>
            </div>
          </div>
        ))}
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
    </SongsListWrapper>
  )
}

export default memo(SongsList)
