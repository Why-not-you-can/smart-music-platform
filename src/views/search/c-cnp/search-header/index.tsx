import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { Input } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  clearSearchResultAction,
  fetchSearchValueAction,
  fetchSongForSearchAction
} from '@/views/search/store/search'
import { SearchHeaderWrapper } from './style'
import SearchDropdown from '@/components/seach-down-list'

interface IProps {
  children?: ReactNode
}

const SearchHeader: FC<IProps> = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const routeKeywords = searchParams.get('keywords') || ''
  const { songList, artistList, albumList } = useAppSelector(
    (state) => state.search
  )
  const [inputValue, setInputValue] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const debounceSearch = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        dispatch(fetchSearchValueAction({ keywords: value, limit: 4 }))
      }, 500)
    },
    [dispatch]
  )

  useEffect(() => {
    if (routeKeywords) {
      setInputValue(routeKeywords)
      debounceSearch(routeKeywords)
    }
  }, [routeKeywords])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setDropdownVisible(!!value.trim())
    if (value.trim()) {
      debounceSearch(value)
    } else {
      dispatch(clearSearchResultAction())
    }
  }
  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 200)
  }

  const handleFocus = () => {
    if (inputValue.trim()) setDropdownVisible(true)
  }

  const handleItemClick = (
    type: 'song' | 'artist' | 'album' | 'user',
    id: number
  ) => {
    if (type === 'song') {
      dispatch(fetchSongForSearchAction(id))
      navigate(`/discover/player`)
    }
    setDropdownVisible(false)
  }
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = inputValue.trim()
    if (!value) return
    navigate(`/search?keywords=${encodeURIComponent(value)}`)
    setDropdownVisible(false)
    setInputValue('')
  }

  return (
    <SearchHeaderWrapper>
      <Input.Search
        className="search"
        allowClear
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onPressEnter={handleEnterPress}
        enterButton={true}
      />

      {dropdownVisible && (
        <SearchDropdown
          inputValue={inputValue}
          songList={songList.slice(0, 4)}
          artistList={artistList}
          albumList={albumList}
          onItemClick={handleItemClick}
        />
      )}
    </SearchHeaderWrapper>
  )
}

export default memo(SearchHeader)
