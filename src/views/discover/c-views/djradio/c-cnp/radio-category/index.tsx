import React, { memo, useEffect, useRef } from 'react'
import type { ElementRef, FC, ReactNode } from 'react'
import { Carousel } from 'antd'
import { BannerControl, RadioCategoryWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  changeCurrentIdAction,
  fetchRadioCategoriesAction,
  toggleContentAction
} from '../../store/djradio'

interface IProps {
  children?: ReactNode
}

const RadioCategory: FC<IProps> = () => {
  const { categories, currentId } = useAppSelector((state) => state.djradio)
  const page = Math.ceil(categories.length / 18) || 1
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchRadioCategoriesAction())
  }, [])
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  function handleNextClick() {
    bannerRef.current?.next()
  }

  const handleCategoryClick = (id: number) => {
    dispatch(toggleContentAction(true))
    dispatch(changeCurrentIdAction(id))
  }

  return (
    <RadioCategoryWrapper>
      <Carousel dots={true} className="dots" ref={bannerRef}>
        {Array(page)
          .fill(0)
          .map((_, index) => {
            const startIndex = index * 18
            const endIndex = (index + 1) * 18
            const currentPageCategories = categories.slice(startIndex, endIndex)
            return (
              <div key={index} className="category-page">
                {currentPageCategories.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className={`category-item ${currentId === item.id ? 'active' : ''}`}
                    >
                      <div
                        className={`image ${currentId === item.id ? 'active' : ''}`}
                        key={item.id}
                      >
                        <img src={item.picWebUrl} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
      </Carousel>
      <BannerControl>
        <button className="btn left" onClick={handlePrevClick}></button>
        <button className="btn right" onClick={handleNextClick}></button>
      </BannerControl>
    </RadioCategoryWrapper>
  )
}

export default memo(RadioCategory)
