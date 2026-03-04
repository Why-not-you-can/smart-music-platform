import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayerWrapper } from './style'
import PlayerComment from './c-cnp/player-comment'
import PlayerInfo from './c-cnp/player-info'
import PlayerRelevant from './c-cnp/player-relevant'
import PlayerSongs from './c-cnp/player-songs'

interface IProps {
  children?: ReactNode
}

const Player: FC<IProps> = () => {
  return (
    <PlayerWrapper>
      <div className="content wrap-v2">
        <div className="left">
          <PlayerInfo />
          <PlayerComment />
        </div>
        <div className="right">
          <PlayerSongs />
          <PlayerRelevant />
        </div>
      </div>
    </PlayerWrapper>
  )
}

export default memo(Player)
