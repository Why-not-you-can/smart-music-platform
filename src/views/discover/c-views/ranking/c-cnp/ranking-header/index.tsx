import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { RankingHeaderWrapper } from './style'
import { formatMonthDay, getImageSize } from '@/utlis/format'
import SongOperationBar from '@/components/song-operation-bar'
import { useRankSelect } from '@/components/useRankSelect'

interface IProps {
  children?: ReactNode
}

const RankingHeader: FC<IProps> = () => {
  const selectedRank = useRankSelect()
  if (!selectedRank || !selectedRank.coverImgUrl) {
    return <div className="loading">加载中...</div> // 加载中提示（可选）
  }
  return (
    <RankingHeaderWrapper>
      <div className="image sprite_cover">
        <img
          src={getImageSize(selectedRank.coverImgUrl, 150)}
          alt={selectedRank.name}
        />
        <span className="image_cover"></span>
      </div>
      <div className="info">
        <div className="title">{selectedRank.name}</div>
        <div className="time">
          <i className="clock sprite_icon2"></i>
          <div>最新更新:{formatMonthDay(selectedRank.updateTime)}</div>
          <div className="update-f">({'每日更新:TODO'})</div>
        </div>
        <SongOperationBar
          favorTitle={`收藏(${selectedRank.subscribedCount})`}
          shareTitle={`分享(${selectedRank.shareCount})`}
          downloadTitle="下载"
        />
      </div>
    </RankingHeaderWrapper>
  )
}

export default memo(RankingHeader)
