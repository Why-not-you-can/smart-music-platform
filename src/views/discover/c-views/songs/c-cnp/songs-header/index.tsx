import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { SongsHeaderWrapper } from './style'
import SongsCategory from '../songs-category'

interface IProps {
  children?: ReactNode
}

const SongsHeader: FC<IProps> = () => {
  const [showCategory, setShowCategory] = useState(false)
  const [currentCategoryName, setCurrentCategoryName] = useState('全部')
  const handleCategorySelect = (name: string) => {
    setCurrentCategoryName(name)
  }
  return (
    <SongsHeaderWrapper>
      <div className="left">
        <div className="title">{currentCategoryName}</div>
        <button
          className="select"
          onClick={() => setShowCategory(!showCategory)}
        >
          <span>选择分类</span>
          <i className="sprite_icon2"></i>
        </button>
        {showCategory ? (
          <SongsCategory onSelect={handleCategorySelect} />
        ) : null}
      </div>
      <div className="right">
        <button className="hot">热门</button>
      </div>
    </SongsHeaderWrapper>
  )
}

export default memo(SongsHeader)
