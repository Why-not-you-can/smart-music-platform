import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTopDetail, getTopList } from '../service/ranking'

export const fetchTopListAction = createAsyncThunk(
  'toplist',
  async (_, { dispatch }) => {
    const topListRes = await getTopList()
    dispatch(changeTopListAction(topListRes.list || []))
  }
)

export const fetchTopDetailAction = createAsyncThunk(
  'topDetail',
  async (id: number, { dispatch }) => {
    const detailRes = await getTopDetail(id)
    const detailData = detailRes.playlist || {}
    dispatch(chageTopDetailAction(detailData))
  }
)

interface IRankingState {
  toplist: any[]
  songlists: any[]
  currentIndex: number
  topDetail: any | null
}

const initialState: IRankingState = {
  toplist: [],
  songlists: [],
  currentIndex: 0,
  topDetail: null
}

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    changeTopListAction(state, { payload }) {
      state.toplist = payload
    },
    changeCurrentIndexAction(state, { payload }) {
      state.currentIndex = payload
    },
    changeSongListsAction(state, { payload }) {
      state.songlists = payload
    },
    chageTopDetailAction(state, { payload }) {
      state.topDetail = payload
    }
  }
})
export const {
  changeTopListAction,
  changeCurrentIndexAction,
  changeSongListsAction,
  chageTopDetailAction
} = rankingSlice.actions
export default rankingSlice.reducer
