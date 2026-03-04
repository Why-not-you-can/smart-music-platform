import { useAppDispatch } from '@/store'
import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import {
  fetchBannerDataAction,
  fetchHotRecommendAction,
  fetchNewAlbumAction,
  fetchRankingDataAction,
  fetchSettleSingerAction
} from './store/recommend'
import TopBanner from './c-cpns/top-banner'
import { RecommendWraper } from './style'
import HotRcommend from './c-cpns/hot-Rcommend'
import NewAlbum from './c-cpns/new-album'
import TopRanking from './c-cpns/top-ranking'
import UserLogin from './c-cpns/user-login'
import SettleSingger from './c-cpns/settle-singger'
import HotAnchor from './c-cpns/hot-anchor'

interface IProps {
  children?: ReactNode
}

const Recommend: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchBannerDataAction())
    dispatch(fetchHotRecommendAction())
    dispatch(fetchNewAlbumAction())
    dispatch(fetchRankingDataAction())
    dispatch(fetchSettleSingerAction())
  }, [])
  return (
    <RecommendWraper>
      <TopBanner />
      <div className="content wrap-v2">
        <div className="left">
          <HotRcommend />
          <NewAlbum />
          <TopRanking />
        </div>
        <div className="right">
          <UserLogin />
          <SettleSingger />
          <HotAnchor />
        </div>
      </div>
    </RecommendWraper>
  )
}

export default memo(Recommend)
