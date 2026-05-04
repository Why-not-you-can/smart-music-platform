import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SearchWrapper } from './style'
import SearchHeader from './c-cnp/search-header'
import SearchList from './c-cnp/search-list'

interface IProps {
  children?: ReactNode
}

const Search: FC<IProps> = () => {
  return (
    <SearchWrapper>
      <SearchHeader />
      <SearchList />
    </SearchWrapper>
  )
}

export default memo(Search)
