import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { RadioRecommendWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchRadioRecommendAction } from '../../store/djradio'
import { getImageSize } from '@/utlis/format'
import ThemeHeaderNormal from '@/components/theme-header-normal'

interface IProps {
  children?: ReactNode
}

const RadioRecommend: FC<IProps> = () => {
  const { currentId, recommends } = useAppSelector((state) => state.djradio)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (currentId === 0) return
    dispatch(fetchRadioRecommendAction(currentId))
  }, [dispatch, currentId])
  return (
    <RadioRecommendWrapper>
      <ThemeHeaderNormal title="优秀电台" />
      <div className="radio-list">
        {recommends.slice(0, 5).map((item) => {
          return (
            <div key={item.id} className="radio-item">
              <a href="/#">
                <img src={getImageSize(item.picUrl, 150)} alt={item.name} />
              </a>
              <a href="/#" className="text-nowrap name">
                {item.name}
              </a>
              <p className="text-nowrap">{item.rcmdtext}</p>
            </div>
          )
        })}
      </div>
    </RadioRecommendWrapper>
  )
}

export default memo(RadioRecommend)
