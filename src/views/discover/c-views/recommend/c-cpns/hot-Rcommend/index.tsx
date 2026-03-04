import AreaHeaderV1 from '@/components/area-header-v1'
import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { RecommendWrapper } from './style'
import { useAppSelector } from '@/store'
import SongMemuItem from '@/components/song-memu-item'
import { useNavigate } from 'react-router-dom'

interface IProps {
  children?: ReactNode
}

const HotRecommend: FC<IProps> = () => {
  const navigate = useNavigate()
  const { hotRecommends = [] } = useAppSelector((state) => ({
    hotRecommends: state.recommend.hotRecommends
  }))
  const keywords = ['华语', '流行', '摇滚', '民谣', '电子']
  const handleKeywordClick = (keyword: string) => {
    navigate('/discover/songs', { state: { category: keyword } })
  }
  return (
    <RecommendWrapper>
      <AreaHeaderV1
        title="热门推荐"
        keywords={keywords}
        moreLink="/discover/songs"
        onKeywordClick={handleKeywordClick}
      />
      <div className="recommend-list">
        {hotRecommends.map((item) => {
          return <SongMemuItem key={item.id} itemData={item} />
        })}
      </div>
    </RecommendWrapper>
  )
}

export default memo(HotRecommend)
