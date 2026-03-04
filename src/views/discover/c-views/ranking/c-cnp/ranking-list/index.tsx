import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { RankingListWrapper } from './style'
import { getImageSize } from '@/utlis/format'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchTopDetailAction, fetchTopListAction } from '../../store/ranking'

interface IProps {
  children?: ReactNode
}

const RankingList: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { toplists = [], topDetail } = useAppSelector((state) => ({
    toplists: state.ranking.toplist,
    topDetail: state.ranking.topDetail
  }))

  const [selectedId, setSelectedId] = useState(0)

  useEffect(() => {
    dispatch(fetchTopListAction())
  }, [dispatch])

  useEffect(() => {
    if (toplists.length > 0) {
      const firstId = toplists[0].id
      setSelectedId(firstId)
      dispatch(fetchTopDetailAction(firstId))
    }
  }, [toplists, dispatch])

  useEffect(() => {
    if (topDetail && topDetail.id) {
      window.dispatchEvent(new CustomEvent('rankSelect', { detail: topDetail }))
    }
  }, [topDetail])

  const lists = [
    { title: '云音乐特色榜', data: toplists.slice(0, 4), startIndex: 0 },
    { title: '全球媒体榜', data: toplists.slice(4), startIndex: 4 }
  ]

  const handleClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedId(id)
    dispatch(fetchTopDetailAction(id))
  }

  return (
    <div>
      {lists.map((list, listIndex) => (
        <RankingListWrapper key={listIndex}>
          <div className="title">{list.title}</div>
          <div className="ranking">
            {list.data.map((item) => {
              return (
                <a
                  key={item.id}
                  className={`item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={(e) => handleClick(item.id, e)}
                >
                  <img src={getImageSize(item.coverImgUrl, 40)} alt="" />
                  <div className="info">
                    <div className="name">{item.name}</div>
                    <div className="update">{item.updateFrequency}</div>
                  </div>
                </a>
              )
            })}
          </div>
        </RankingListWrapper>
      ))}
    </div>
  )
}

export default memo(RankingList)
