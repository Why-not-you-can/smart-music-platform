import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { ArtistCategoryWrapper, CategoryItem } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  changeCurrentAreaAction,
  changeCurrentTypeAction
} from '../../store/singer'
import { artistCategories } from '@/assets/data/local_data'

interface IProps {
  children?: ReactNode
}

const ArtistCategory: FC<IProps> = () => {
  const { currentArea, currentType } = useAppSelector((state) => state.singer)
  const dispatch = useAppDispatch()
  const selectArtist = (area, type) => {
    dispatch(changeCurrentAreaAction(area))
    dispatch(changeCurrentTypeAction(type))
  }

  const renderArtist = (artists, area) => {
    return (
      <div>
        {artists.map((item) => {
          const isSelect =
            currentArea === area && currentType.type === item.type
          return (
            <CategoryItem
              key={item.name}
              className={`base-class-name ${isSelect ? 'active' : ''}`}
            >
              <span onClick={() => selectArtist(area, item)}>{item.name}</span>
            </CategoryItem>
          )
        })}
      </div>
    )
  }

  return (
    <ArtistCategoryWrapper>
      {artistCategories.map((item) => {
        return (
          <div className="section" key={item.area}>
            <h2 className="title">{item.title}</h2>
            {renderArtist(item.artists, item.area)}
          </div>
        )
      })}
    </ArtistCategoryWrapper>
  )
}

export default memo(ArtistCategory)
