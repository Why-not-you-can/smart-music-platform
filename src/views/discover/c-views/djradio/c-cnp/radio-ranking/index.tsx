import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { RadioRankingWrapper } from './style'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchRadiosAction } from '../../store/djradio'
import RadioRankingCover from '@/components/radio-ranking-cover'
import IPagination from '@/components/pagination'
import ThemeHeaderNormal from '@/components/theme-header-normal'
interface IProps {
  children?: ReactNode
}

const RadioRanking: FC<IProps> = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { currentId, radios } = useAppSelector((state) => state.djradio)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (currentId === 0) return
    dispatch(fetchRadiosAction([currentId, 1]))
  }, [currentId, dispatch])

  const onPageChange = (page) => {
    setCurrentPage(page)
    dispatch(fetchRadiosAction([currentId, page]))
  }

  return (
    <RadioRankingWrapper>
      <ThemeHeaderNormal title="电台排行榜" />
      <div className="ranking-list">
        {radios.map((item) => {
          return <RadioRankingCover key={item.id} radio={item} />
        })}
      </div>
      <IPagination
        currentPage={currentPage}
        total={1000}
        pageSize={30}
        onPageChange={onPageChange}
      />
    </RadioRankingWrapper>
  )
}

export default memo(RadioRanking)
