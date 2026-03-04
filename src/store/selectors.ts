// src/store/selectors.ts
import type { IRootState } from './index'

// 推荐页面相关选择器
export const selectRecommendBanners = (state: IRootState) =>
  state.recommend.banners
export const selectRecommendHotRecommends = (state: IRootState) =>
  state.recommend.hotRecommends
export const selectRecommendNewAlbums = (state: IRootState) =>
  state.recommend.newAlbums
export const selectRecommendRankings = (state: IRootState) =>
  state.recommend.rankings
export const selectRecommendSettleSingers = (state: IRootState) =>
  state.recommend.settleSingers

// 播放器相关选择器
export const selectPlayerCurrentSong = (state: IRootState) =>
  state.player.currentSong
export const selectPlayerLyrics = (state: IRootState) => state.player.lyrics
export const selectPlayerLyricIndex = (state: IRootState) =>
  state.player.lyricIndex
export const selectPlayerPlaySongList = (state: IRootState) =>
  state.player.playSongList
export const selectPlayerPlaySongIndex = (state: IRootState) =>
  state.player.playSongIndex
export const selectPlayerPlayMode = (state: IRootState) => state.player.playMode
export const selectPlayerSimiSongs = (state: IRootState) =>
  state.player.simiSongs
export const selectPlayerSimiPlaylist = (state: IRootState) =>
  state.player.simiPlaylist
