import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SinggerWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { useAppSelector } from '@/store'
import { getImageSize } from '@/utlis/format'

interface IProps {
  children?: ReactNode
}

const SettleSingger: FC<IProps> = () => {
  const { settleSinggers = [] } = useAppSelector((state) => ({
    settleSinggers: state.recommend.settleSingers
  }))
  return (
    <SinggerWrapper>
      <AreaHeaderV2
        title="入住歌手"
        moreText="查看全部 &gt;"
        moreLink="#/discover/singger"
      />
      <div className="singer">
        {settleSinggers.map((item) => {
          return (
            <a href="#/discover/singger" className="item" key={item.id}>
              <img src={getImageSize(item.picUrl, 62)} alt="" />
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="alias">{item.alias.join('')}</div>
              </div>
            </a>
          )
        })}
      </div>
      <div className="apply-for">
        <a href="#/">申请成为音乐人</a>
      </div>
    </SinggerWrapper>
  )
}

export default memo(SettleSingger)
