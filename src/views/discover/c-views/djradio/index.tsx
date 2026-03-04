import React, { memo, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { DjradioWrapper } from './style'
import RadioCategory from './c-cnp/radio-category'
import RadioRecommend from './c-cnp/radio-recommend'
import RadioRanking from './c-cnp/radio-ranking'
import { useAppDispatch } from '@/store'
import { fetchRadioCategoriesAction } from './store/djradio'

interface IProps {
  children?: ReactNode
}

const Djradio: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchRadioCategoriesAction())
  }, [dispatch])
  return (
    <DjradioWrapper className="wrap-v2">
      <RadioCategory />
      <RadioRecommend />
      <RadioRanking />
    </DjradioWrapper>
  )
}

export default memo(Djradio)
