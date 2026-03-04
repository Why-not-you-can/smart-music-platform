import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { AlphaListWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchArtistListAction } from '../../../../store/singer'
import { singerAlphas } from '@/utlis/handle-data'

interface IProps {
  children?: ReactNode
}

const AlphaList: FC<IProps> = () => {
  const [currentAlpha, setCurrentAlpha] = useState('-1')
  const { currentType, currentArea } = useAppSelector((state) => state.singer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setCurrentAlpha('-1')
  }, [currentType, currentArea])
  useEffect(() => {
    dispatch(
      fetchArtistListAction({
        area: currentArea,
        type: currentType.type,
        alpha: currentAlpha
      })
    )
  }, [currentAlpha, currentType, currentArea, dispatch])

  return (
    <AlphaListWrapper hasTop={currentArea !== -1}>
      {currentArea !== -1 &&
        singerAlphas.map((item) => {
          const isActive = currentAlpha === item
          let displayText = item
          const isTextItem = item === '0' || item === '-1'
          if (item === '0') displayText = '其他'
          if (item === '-1') displayText = '热门'
          return (
            <div
              key={item}
              className={`item ${isActive ? 'active' : ''} ${isTextItem ? 'text-item' : 'letter-item'}`}
            >
              <span onClick={() => setCurrentAlpha(item)}>
                {displayText.toUpperCase()}
              </span>
            </div>
          )
        })}
    </AlphaListWrapper>
  )
}

export default memo(AlphaList)
