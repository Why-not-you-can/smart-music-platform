import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SongWrapper } from './style'
import SongsHeader from './c-cnp/songs-header'
import SongsList from './c-cnp/songs-list'

interface IProps {
  children?: ReactNode
}

const Songs: FC<IProps> = () => {
  return (
    <SongWrapper className="wrap-v2">
      <SongsHeader />
      <SongsList />
    </SongWrapper>
  )
}

export default memo(Songs)
