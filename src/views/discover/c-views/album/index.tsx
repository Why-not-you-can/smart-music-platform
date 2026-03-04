import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { AlbumWrapper } from './style'
import HotAlbum from './c-cnp/hot-album'
import TopAlbum from './c-cnp/top-album'

interface IProps {
  children?: ReactNode
}

const Album: FC<IProps> = () => {
  return (
    <AlbumWrapper className="wrap-v2">
      <HotAlbum />
      <TopAlbum />
    </AlbumWrapper>
  )
}

export default memo(Album)
