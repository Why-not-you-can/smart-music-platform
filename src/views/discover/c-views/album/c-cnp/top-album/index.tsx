import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { TopAlbumWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTopAlbumsAction } from '../../store/album'
import ThemeHeaderNormal from '@/components/theme-header-normal'
import AlbumCover from '@/components/album-cover'
import IPagination from '@/components/pagination'

interface IProps {
  children?: ReactNode
}

const TopAlbum: FC<IProps> = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { topAlbums = [], topTotal = 0 } = useAppSelector(
    (state) => state.album
  )
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTopAlbumsAction(1))
  }, [dispatch])

  const onpageChange = (page) => {
    setCurrentPage(page)
    dispatch(fetchTopAlbumsAction(page))
  }

  return (
    <TopAlbumWrapper>
      <ThemeHeaderNormal title="全部新碟" />
      <div className="album-list">
        {topAlbums.map((item) => {
          return (
            <AlbumCover
              size={'130px'}
              width={'153px'}
              bgp={'-845px'}
              key={item.id}
              info={item}
            />
          )
        })}
      </div>
      <IPagination
        currentPage={currentPage}
        total={topTotal}
        pageSize={35}
        onPageChange={onpageChange}
      />
    </TopAlbumWrapper>
  )
}

export default memo(TopAlbum)
