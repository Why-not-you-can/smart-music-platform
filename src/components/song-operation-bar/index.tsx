import React, { memo, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import { OperationBarWrapper } from './style'
interface IProps {
  children?: ReactNode
  favorTitle: any
  shareTitle: any
  downloadTitle: any
  onPlayClick?: () => void
  onShareClick?: () => void
  onFavorClick?: () => void
}

const OperationBar: FC<IProps> = (props) => {
  const {
    favorTitle,
    shareTitle,
    downloadTitle,
    onPlayClick,
    onShareClick,
    onFavorClick
  } = props
  const handleInternalPlayClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onPlayClick?.()
    },
    [onPlayClick]
  )
  const handleShare = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onShareClick?.()
    },
    [onShareClick]
  )

  const handleFavor = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      onFavorClick?.()
    },
    [onFavorClick]
  )
  return (
    <OperationBarWrapper>
      <span className="play" onClick={handleInternalPlayClick}>
        <button className="play-icon sprite_button">
          <span className="play sprite_button">
            <i className="sprite_button"></i>
            <span>播放</span>
          </span>
        </button>
        <div className="add-icon sprite_button">+</div>
      </span>
      <div className="item sprite_button" onClick={handleFavor}>
        <i className="icon favor-icon sprite_button">{favorTitle}</i>
      </div>
      <div className="item sprite_button" onClick={handleShare}>
        <i className="icon share-icon sprite_button">{shareTitle}</i>
      </div>
      <div className="item sprite_button">
        <i className="icon download-icon sprite_button">{downloadTitle}</i>
      </div>
    </OperationBarWrapper>
  )
}

export default memo(OperationBar)
