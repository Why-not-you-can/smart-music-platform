import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SearchDropdownWrapper } from './style'
import {
  UserOutlined,
  CompassOutlined,
  MinusCircleOutlined
} from '@ant-design/icons'

interface IProps {
  children?: ReactNode
  inputValue: string
  songList: any[]
  artistList: any[]
  albumList: any[]
  onItemClick?: (type: 'song' | 'artist' | 'album' | 'user', id: number) => void
}

const SearchDropdown: FC<IProps> = ({
  inputValue,
  songList,
  artistList,
  albumList,
  onItemClick
}) => {
  const renderHighlightText = (text: string) => {
    if (!inputValue.trim()) return text
    const reg = new RegExp(
      `(${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'ig'
    )
    const parts = text.split(reg)
    return parts.map((part, index) =>
      part.toLowerCase() === inputValue.toLowerCase() ? (
        <span key={index} className="highlight-keyword">
          {part}
        </span>
      ) : (
        part
      )
    )
  }
  const hasResult =
    songList.length > 0 || artistList.length > 0 || albumList.length > 0
  if (!hasResult) return null
  return (
    <SearchDropdownWrapper>
      <div className="user-entry" onClick={() => onItemClick?.('user', 0)}>
        搜“{inputValue}”相关用户 &gt;
      </div>

      {songList.length > 0 && (
        <div className="search-row">
          <div className="category-cell">
            <MinusCircleOutlined className="category-icon" />
            <span className="category-text">单曲</span>
          </div>
          <div className="list-cell">
            {songList.slice(0, 4).map((song) => (
              <div
                key={song.id}
                className="list-item"
                onClick={() => onItemClick?.('song', song.id)}
              >
                {renderHighlightText(song.name)}
                <span className="item-sub">
                  -{song.ar?.map((a: any) => a.name).join(' / ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {artistList.length > 0 && (
        <div className="search-row">
          <div className="category-cell">
            <UserOutlined className="category-icon" />
            <span className="category-text">歌手</span>
          </div>
          <div className="list-cell">
            {artistList.slice(0, 2).map((artist) => (
              <div
                key={artist.id}
                className="list-item"
                onClick={() => onItemClick?.('artist', artist.id)}
              >
                {renderHighlightText(artist.name)}
              </div>
            ))}
          </div>
        </div>
      )}
      {albumList.length > 0 && (
        <div className="search-row">
          <div className="category-cell">
            <CompassOutlined className="category-icon" />
            <span className="category-text">专辑</span>
          </div>
          <div className="list-cell">
            {albumList.slice(0, 2).map((album) => (
              <div
                key={album.id}
                className="list-item"
                onClick={() => onItemClick?.('album', album.id)}
              >
                {renderHighlightText(album.name)}
                <span className="item-sub">-{album.artist?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SearchDropdownWrapper>
  )
}

export default memo(SearchDropdown)
