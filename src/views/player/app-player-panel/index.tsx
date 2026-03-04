import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PlayerPannelWrapper } from './style'
import PlayList from './c-cpns/play-list'
import PlayHeder from './c-cpns/play-heder'
import LyricPanel from './c-cpns/lyric-panel'

interface IProps {
  children?: ReactNode
  visible: boolean
}

const PlayerPanel: FC<IProps> = ({ visible }) => {
  return (
    <PlayerPannelWrapper visible={visible}>
      <PlayHeder />
      <div className="main">
        <img
          className="image"
          src="https://p4.music.126.net/qeN7o2R3_OTPhghmkctFBQ==/764160591569856.jpg"
          alt=""
        />
        <PlayList />
        <LyricPanel />
      </div>
    </PlayerPannelWrapper>
  )
}

export default memo(PlayerPanel)
