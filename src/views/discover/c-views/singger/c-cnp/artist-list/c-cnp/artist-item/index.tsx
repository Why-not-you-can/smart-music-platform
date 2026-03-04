import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { ArtistItemWrapper } from './style'
import { getImageSize } from '@/utlis/format'

interface IProps {
  children?: ReactNode
  index?: any
  info?: any
}

const ArtistItem: FC<IProps> = (props) => {
  const { index, info } = props
  return (
    <ArtistItemWrapper>
      {index < 10 && (
        <div className="image">
          <img src={getImageSize(info.img1v1Url, 130)} alt="" />
        </div>
      )}
      <div className="info">
        <span className="name">{info.name}</span>
        <i className="sprite_icon2 icon"></i>
      </div>
    </ArtistItemWrapper>
  )
}

export default memo(ArtistItem)
