import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAlbumDetial, getHotAlbums, getTopAlbums } from '../service/album'

export const fetchHotAlbumsAction = createAsyncThunk(
  'hotalbum',
  async (_, { dispatch }) => {
    const res = await getHotAlbums()
    dispatch(changeHotAlbumsAction(res.albums))
  }
)

export const fetchTopAlbumsAction = createAsyncThunk(
  'topalbum',
  async (page: any, { dispatch }) => {
    const res = await getTopAlbums(35, (page - 1) * 35)
    dispatch(changeTopAlbumAction(res.albums))
    dispatch(changeTopTotalAction(res.total))
  }
)

export const fetchAlbumDetialAction = createAsyncThunk(
  'albumdetial',
  async (id, { dispatch }) => {
    const res = await getAlbumDetial(id)
    console.log('专辑detial接口原始返回：', res)
    dispatch(changeAlbumDetailAction(res.albums))
  }
)

interface IAlbumState {
  hotAlbums: any[]
  topAlbums: any[]
  topTotal: number
  albumDetail: any[]
}
const initialState: IAlbumState = {
  hotAlbums: [],
  topAlbums: [],
  topTotal: 0,
  albumDetail: []
}
const AlbumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    changeHotAlbumsAction(state, { payload }) {
      state.hotAlbums = payload
    },
    changeTopAlbumAction(state, { payload }) {
      state.topAlbums = payload
    },
    changeTopTotalAction(state, { payload }) {
      state.topTotal = payload
    },
    changeAlbumDetailAction(state, { payload }) {
      state.albumDetail = payload
    }
  }
})
export const {
  changeHotAlbumsAction,
  changeTopAlbumAction,
  changeTopTotalAction,
  changeAlbumDetailAction
} = AlbumSlice.actions
export default AlbumSlice.reducer
