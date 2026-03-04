import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { SongsCategoryWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  changeCurrentCategoryAction,
  fetchSongListAction,
  fetchCategoryAction
} from '../../store/song'
import { useLocation } from 'react-router-dom'

interface IProps {
  children?: ReactNode
  onSelect: (categoryName: string) => void
}

const SongsCategory: FC<IProps> = ({ onSelect }) => {
  const { category, currentCategory } = useAppSelector((state) => state.song)

  const location = useLocation()
  const { category: routeCategory } = location.state || {}

  const dispatch = useAppDispatch()
  function selectCategory(name) {
    onSelect(name)
    dispatch(changeCurrentCategoryAction(name))
    dispatch(fetchSongListAction(0))
  }

  useEffect(() => {
    dispatch(fetchCategoryAction())
    if (routeCategory) {
      dispatch(fetchCategoryAction()).then(() => {
        selectCategory(routeCategory)
      })
    } else {
      dispatch(fetchSongListAction(0))
    }
  }, [dispatch, routeCategory])

  useEffect(() => {
    dispatch(fetchCategoryAction())
    dispatch(fetchSongListAction(0))
  }, [dispatch])

  return (
    <SongsCategoryWrapper>
      <div className="arrow sprite_icon"></div>
      <div className="all">
        <span
          className={`link ${currentCategory === '全部' ? 'active' : ''}`}
          onClick={() => selectCategory('全部')}
        >
          全部风格
        </span>
      </div>
      <div className="category">
        {category.map((item, index) => {
          return (
            <dl key={item.name} className={'item' + index}>
              <dt>
                <i className="icon sprite_icon2"></i>
                <span>{item.name}</span>
              </dt>
              <dd>
                {item.subs.map((sItem) => {
                  return (
                    <div className="item" key={sItem.name}>
                      <span
                        className={`link ${currentCategory === sItem.name ? 'active' : ''}`}
                        onClick={() => selectCategory(sItem.name)}
                      >
                        {sItem.name}
                      </span>
                      <span className="divider">|</span>
                    </div>
                  )
                })}
              </dd>
            </dl>
          )
        })}
      </div>
    </SongsCategoryWrapper>
  )
}

export default memo(SongsCategory)
