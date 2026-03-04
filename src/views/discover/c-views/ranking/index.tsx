import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { LeftWrapper, RankingWrapper, RightWrapper } from './style'
import RankingList from './c-cnp/ranking-list'
import SongList from './c-cnp/ranking-song-list'
import RankingHeader from './c-cnp/ranking-header'

interface IProps {
  children?: ReactNode
}

const Ranking: FC<IProps> = () => {
  return (
    <RankingWrapper className="wrap-v2">
      <LeftWrapper>
        <RankingList />
      </LeftWrapper>
      <RightWrapper>
        <RankingHeader />
        <SongList />
      </RightWrapper>
    </RankingWrapper>
  )
}

export default memo(Ranking)
