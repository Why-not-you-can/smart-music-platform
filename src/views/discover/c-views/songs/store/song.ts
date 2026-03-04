import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getPlaylistDetail,
  getSimiPlaylist,
  getSongCategory,
  getSongCategoryList
} from '../service/song'
import { handleSongsCategory } from '@/utlis/handle-data'
import { IRootState } from '@/store'

export const fetchCategoryAction = createAsyncThunk(
  'category',
  async (_, { dispatch }) => {
    const res = await getSongCategory()
    const categoryData = handleSongsCategory(res)
    dispatch(changeCategoryAction(categoryData))
  }
)

export const fetchSongListAction = createAsyncThunk(
  'songlist',
  async (page: number, { dispatch, getState }) => {
    const state = getState() as IRootState
    const name = state.song.currentCategory
    const res = await getSongCategoryList(name, page * 35)
    dispatch(changeSongListAction(res))
  }
)

export const fetchSongsDetailAction = createAsyncThunk(
  'songsDetial',
  async (id: number, { dispatch }) => {
    const detailRes = await getPlaylistDetail(id)
    const detailData = detailRes.playlist || {}
    dispatch(changeSongsDetailAction(detailData))
  }
)

export const fetchSimiPlayListAction = createAsyncThunk(
  'simiPlaylist',
  async (_, { dispatch, getState }) => {
    const state = getState() as any
    const playlistId = state.song.songsDetail?.id
    if (playlistId) {
      const res = await getSimiPlaylist(playlistId)
      dispatch(changeSimiPlayListAction(res?.playlists || []))
    } else {
      dispatch(changeSimiPlayListAction([]))
    }
  }
)

interface ISongState {
  category: any[]
  currentCategory: any
  categorySongs: any[]
  songsDetail: any | null
  simiPlaylist: any[]
}

const initialState: ISongState = {
  category: [],
  currentCategory: '全部',
  categorySongs: [],
  songsDetail: null,
  simiPlaylist: []
}

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    changeCategoryAction(state, { payload }) {
      state.category = payload
    },
    changeSongListAction(state, { payload }) {
      state.categorySongs = payload
    },
    changeCurrentCategoryAction(state, { payload }) {
      state.currentCategory = payload
    },
    changeSongsDetailAction(state, { payload }) {
      state.songsDetail = payload
    },
    changeSimiPlayListAction(state, { payload }) {
      state.simiPlaylist = payload
    }
  }
})

export const {
  changeCategoryAction,
  changeSongListAction,
  changeCurrentCategoryAction,
  changeSongsDetailAction,
  changeSimiPlayListAction
} = songSlice.actions

export default songSlice.reducer
