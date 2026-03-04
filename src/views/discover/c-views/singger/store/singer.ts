import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getArtistList } from '../service/singer'

export const fetchArtistListAction = createAsyncThunk(
  'artistlist',
  async (
    { area, type, alpha }: { area: any; type: any; alpha: any },
    { dispatch }
  ) => {
    const res = await getArtistList(area, type, alpha)
    dispatch(changeArtistListAction(res.artists || []))
  }
)

interface ISingerState {
  currentArea: any
  currentType: {
    name: string
    type: number
  }
  artistList: any[]
}
const initialState: ISingerState = {
  currentArea: 7,
  currentType: {
    name: '推荐歌手',
    type: 1
  },
  artistList: []
}
const singerSlice = createSlice({
  name: 'singer',
  initialState,
  reducers: {
    changeArtistListAction(state, { payload }) {
      state.artistList = payload
    },
    changeCurrentAreaAction(state, { payload }) {
      state.currentArea = payload
    },
    changeCurrentTypeAction(state, { payload }) {
      state.currentType = payload
    }
  }
})
export const {
  changeArtistListAction,
  changeCurrentAreaAction,
  changeCurrentTypeAction
} = singerSlice.actions
export default singerSlice.reducer
