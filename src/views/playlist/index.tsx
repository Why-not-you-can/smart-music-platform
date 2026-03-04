import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayListWrapper } from './style'
import PlaylistSimilist from './c-cnp/playlist-similist'
import PlaylistInfo from './c-cnp/playlist-info'
import PlaylistSongs from './c-cnp/playlist-songs'

interface IProps {
  children?: ReactNode
}

const PlayList: FC<IProps> = () => {
  return (
    <PlayListWrapper>
      <div className="content wrap-v2">
        <div className="left">
          <PlaylistInfo />
          <PlaylistSongs />
        </div>
        <div className="right">
          <PlaylistSimilist />
        </div>
      </div>
    </PlayListWrapper>
  )
}

export default memo(PlayList)
