import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { HotAlbumWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchHotAlbumsAction } from '../../store/album'
import ThemeHeaderNormal from '@/components/theme-header-normal'
import AlbumCover from '@/components/album-cover'

interface IProps {
  children?: ReactNode
}

const HotAlbum: FC<IProps> = () => {
  const { hotAlbums = [] } = useAppSelector((state) => state.album)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchHotAlbumsAction())
  }, [dispatch])
  return (
    <HotAlbumWrapper>
      <ThemeHeaderNormal title="热门新碟" />
      <div className="album-list">
        {hotAlbums.slice(0, 10).map((item) => {
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
    </HotAlbumWrapper>
  )
}

export default memo(HotAlbum)
