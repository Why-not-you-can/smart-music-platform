import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SingerWrapper } from './style'
import ArtistList from './c-cnp/artist-list'
import ArtistCategory from './c-cnp/artist-category'

interface IProps {
  children?: ReactNode
}

const Singer: FC<IProps> = () => {
  return (
    <SingerWrapper>
      <div className="content wrap-v2">
        <ArtistCategory />
        <ArtistList />
      </div>
    </SingerWrapper>
  )
}

export default memo(Singer)
