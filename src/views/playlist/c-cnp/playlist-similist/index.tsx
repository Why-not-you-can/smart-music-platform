import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { SimiListWrapper } from './style'
import ThemeHeaderPlayer from '@/components/theme-header-player'
import { getImageSize } from '@/utlis/format'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  fetchSimiPlayListAction,
  fetchSongsDetailAction
} from '@/views/discover/c-views/songs/store/song'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const PlayListSimiList: FC<IProps> = () => {
  const { songsDetail, simiPlaylist } = useAppSelector((state) => state.song)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (songsDetail?.id) {
      dispatch(fetchSimiPlayListAction())
    }
  }, [dispatch, songsDetail?.id])

  const handleGoToDetail = async (id: number) => {
    await dispatch(fetchSongsDetailAction(id)).unwrap()
    navigate(`/discover/playlist`)
  }

  return (
    <SimiListWrapper>
      <ThemeHeaderPlayer title="相关推荐" />
      <div className="songs">
        {simiPlaylist?.map((item, index) => {
          return (
            <div className="song-item" key={`${item.id}-${index}`}>
              <div
                className="image"
                onClick={() => handleGoToDetail(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <img src={getImageSize(item.coverImgUrl, 50)} alt="" />
              </div>
              <div className="info text-nowrap">
                <div
                  className="name"
                  onClick={() => handleGoToDetail(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </div>
                <div className="auchor">
                  by
                  <a href="#/" className="nickname">
                    {item.creator.nickname}
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SimiListWrapper>
  )
}

export default memo(PlayListSimiList)
