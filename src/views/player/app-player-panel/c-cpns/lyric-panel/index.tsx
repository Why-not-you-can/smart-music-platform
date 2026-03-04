import React, { memo, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { LyricPanelWrapper } from './style'
import { useAppSelector } from '@/store'
import { scrollTo } from '@/utlis/helper-ui'

interface IProps {
  children?: ReactNode
}

const LyricPanel: FC<IProps> = () => {
  const { lyrics, lyricIndex } = useAppSelector((state) => ({
    lyrics: state.player.lyrics,
    lyricIndex: state.player.lyricIndex
  }))

  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (lyricIndex > 0 && lyricIndex < 3) return
    scrollTo(panelRef.current, (lyricIndex - 3) * 32, 300)
  }, [lyricIndex])

  return (
    <LyricPanelWrapper>
      <div className="lrc-content">
        {lyrics.map((item, index) => {
          return (
            <div
              key={`${item.time}-${index}`} // 确保 key 唯一
              className={`lrc-item ${index === lyricIndex ? 'active' : ''}`}
            >
              {item.text}
            </div>
          )
        })}
      </div>
    </LyricPanelWrapper>
  )
}

export default memo(LyricPanel)
