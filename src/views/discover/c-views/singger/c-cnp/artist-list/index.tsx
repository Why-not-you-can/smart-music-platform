import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { ArtistListWapper } from './style'
import { useAppSelector } from '@/store'
import ThemeHeaderNormal from '@/components/theme-header-normal'
import AlphaList from './c-cnp/alpha-list'
import ArtistItem from './c-cnp/artist-item'

interface IProps {
  children?: ReactNode
}

const ArtistList: FC<IProps> = () => {
  const { currentType, artistList } = useAppSelector((state) => state.singer)
  return (
    <ArtistListWapper>
      <ThemeHeaderNormal title={currentType.name} />
      <AlphaList />
      <div className="artist-list">
        {artistList.map((item, index) => {
          return <ArtistItem key={item.id} index={index} info={item} />
        })}
      </div>
    </ArtistListWapper>
  )
}

export default memo(ArtistList)
