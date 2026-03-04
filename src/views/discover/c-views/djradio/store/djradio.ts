import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDjCatlist, getDjRadio, getDjRecommend } from '../service/djradio'

export const fetchRadioCategoriesAction = createAsyncThunk(
  'categories',
  async (_, { dispatch }) => {
    const res = await getDjCatlist()
    const categories = res?.categories || []
    dispatch(changeCategoryAction(categories))
    const currentId = res.categories?.[0]?.id || 0
    dispatch(changeCurrentIdAction(currentId))
    if (currentId) {
      dispatch(fetchRadioRecommendAction(currentId))
      dispatch(fetchRadiosAction([currentId, 0]))
    }
  }
)

export const fetchRadioRecommendAction = createAsyncThunk(
  'recommends',
  async (currentId: number, { dispatch }) => {
    const res = await getDjRecommend(currentId)
    dispatch(
      changeRecommendsAction(Array.isArray(res.djRadios) ? res.djRadios : [])
    )
  }
)

export const fetchRadiosAction = createAsyncThunk(
  'radios',
  async ([currentId, page]: [any, number], { dispatch }) => {
    const limit = 26
    const offset = (page - 1) * limit
    const res = await getDjRadio(currentId, limit, offset)
    const radioList = Array.isArray(res.djRadios) ? res.djRadios : []
    dispatch(changeRadiosAction(radioList))
    dispatch(changeHasMoreAction(radioList.length === limit))
  }
)

interface IDjradioState {
  categories: any[]
  currentId: number
  recommends: any[]
  radios: any[]
  showContent: boolean
  hasMore?: boolean
}

const initialState: IDjradioState = {
  categories: [],
  currentId: 0,
  recommends: [],
  radios: [],
  showContent: true,
  hasMore: true
}

const djradioSlice = createSlice({
  name: 'djradio',
  initialState,
  reducers: {
    changeCategoryAction(state, { payload }) {
      state.categories = payload
    },
    changeRecommendsAction(state, { payload }) {
      state.recommends = payload
    },
    changeRadiosAction(state, { payload }) {
      state.radios = payload
    },
    changeCurrentIdAction(state, { payload }) {
      state.currentId = payload
    },
    toggleContentAction(state, { payload }) {
      state.showContent = payload
    },
    changeHasMoreAction(state, { payload }) {
      state.hasMore = payload
    }
  }
})

export const {
  changeCategoryAction,
  changeRecommendsAction,
  changeRadiosAction,
  changeCurrentIdAction,
  toggleContentAction,
  changeHasMoreAction
} = djradioSlice.actions
export default djradioSlice.reducer
