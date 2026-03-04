import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getBanners,
  getHotRecommend,
  getNewAlbum,
  getPlaylistDetail,
  getSinggerList
} from '../service/recommend'
export const fetchBannerDataAction = createAsyncThunk(
  'banners',
  async (arg, { dispatch }) => {
    const res = await getBanners()
    dispatch(changeBannersAction(res.banners))
  }
)

export const fetchHotRecommendAction = createAsyncThunk(
  'HotRecommend',
  async (_, { dispatch }) => {
    const res = await getHotRecommend(8)
    dispatch(changeHotRecommendsAction(res.result))
  }
)
export const fetchPlayListDetailAction = createAsyncThunk(
  'PlayListDetail',
  async (id: number, { dispatch }) => {
    const res = await getPlaylistDetail(id)
    dispatch(changePlayListDetailAction(res.playlist))
  }
)

export const fetchNewAlbumAction = createAsyncThunk(
  'NewAlbum',
  async (arg, { dispatch }) => {
    const res = await getNewAlbum()
    dispatch(changeNewAlbumsAction(res.albums))
  }
)
export const fetchSettleSingerAction = createAsyncThunk(
  'SettleSinger',
  async (arg, { dispatch }) => {
    const res = await getSinggerList(5)
    dispatch(changeSettleSinggerAction(res.artists))
  }
)

const rankingIds = [19723756, 3779629, 2884035]
export const fetchRankingDataAction = createAsyncThunk(
  'RankingData',
  async (arg, { dispatch }) => {
    const promises: Promise<any>[] = []
    for (const id of rankingIds) {
      promises.push(getPlaylistDetail(id))
    }
    Promise.all(promises).then((res) => {
      if (!res || !Array.isArray(res)) return
      const playlists = res
        .filter((item) => item.playlist)
        .map((item) => item.playlist)
      dispatch(changeRankingAction(playlists))
    })
  }
)

interface IRecommendState {
  banners: any[]
  hotRecommends: any[]
  newAlbums: any[]
  rankings: any[]
  settleSingers: any[]
  playlistDetails: any[]
}
const initialState: IRecommendState = {
  banners: [],
  hotRecommends: [],
  newAlbums: [],
  rankings: [],
  settleSingers: [],
  playlistDetails: []
}
const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {
    changeBannersAction(state, { payload }) {
      state.banners = payload
    },
    changeHotRecommendsAction(state, { payload }) {
      state.hotRecommends = payload
    },
    changeNewAlbumsAction(state, { payload }) {
      state.newAlbums = payload
    },
    changeRankingAction(state, { payload }) {
      state.rankings = payload
    },
    changeSettleSinggerAction(state, { payload }) {
      state.settleSingers = payload
    },
    changePlayListDetailAction(state, { payload }) {
      state.playlistDetails = payload
    }
  }
})
export const {
  changeBannersAction,
  changeHotRecommendsAction,
  changeNewAlbumsAction,
  changeRankingAction,
  changeSettleSinggerAction,
  changePlayListDetailAction
} = recommendSlice.actions
export default recommendSlice.reducer
