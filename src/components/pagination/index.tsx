import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { PaginationWrapper } from './style'
import { Pagination } from 'antd'

interface IProps {
  children?: ReactNode
  currentPage: number
  total: number
  onPageChange: (page: number) => void
  pageSize?: number
}

const IPagination: FC<IProps> = (props) => {
  const { currentPage, total, onPageChange, pageSize = 35 } = props
  function itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <button className="control prev"> &lt; 上一页</button>
    }
    if (type === 'next') {
      return <button className="control next">下一页 &gt;</button>
    }
    return originalElement
  }

  return (
    <PaginationWrapper>
      <Pagination
        className="pagination"
        size="small"
        current={currentPage}
        defaultCurrent={1}
        total={total}
        pageSize={pageSize}
        showSizeChanger={false}
        itemRender={itemRender}
        onChange={onPageChange}
      />
    </PaginationWrapper>
  )
}

export default memo(IPagination)
