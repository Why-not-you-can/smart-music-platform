import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSearch } from '../service/search'
import { getSongDetail, getSongLyric } from '@/views/player/service/player'
import {
  changeCurrentSongAction,
  changeLyricsAction
} from '@/views/player/store/player'
import { parseLyric } from '@/utlis/parse-lyric'

export const fetchSearchValueAction = createAsyncThunk(
  'search/fetchSearch',
  async (
    params: { keywords: string; limit?: number; offset?: number },
    { dispatch }
  ) => {
    const { keywords, limit = 8, offset = 0 } = params
    if (!keywords.trim()) {
      dispatch(clearSearchResultAction())
      return
    }
    const search = await getSearch(keywords, limit, offset, 1018)
    dispatch(
      setSearchResultAction({
        keyword: keywords,
        songList: search.result?.song?.songs || [],
        artistList: search.result?.artist?.artists || [],
        albumList: search.result?.album?.albums || [],
        videoList: search.result?.video?.videos || [],
        lryicList: search.result?.lyric?.lyrics || [],
        songsList: search.result?.songs?.songs || [],
        anchorList: search.result?.anchor?.anchors || [],
        userList: search.result?.user?.users || []
      })
    )
  }
)
export const fetchSongForSearchAction = createAsyncThunk<void, number>(
  'search/fetchSongForSearch',
  async (id, { dispatch }) => {
    const res = await getSongDetail(id)
    if (res.songs.length) {
      dispatch(changeCurrentSongAction(res.songs[0]))
    }
    const lyricRes = await getSongLyric(id)
    const lyricString = lyricRes.lrc?.lyric || ''
    const lyrics = parseLyric(lyricString)
    dispatch(changeLyricsAction(lyrics))
  }
)
interface ISearchState {
  keyword: string
  songList: any[]
  artistList: any[]
  albumList: any[]
  videoList: any[]
  lryicList: any[]
  songsList: any[]
  anchorList: any[]
  userList: any[]
}

const initialState: ISearchState = {
  keyword: '',
  songList: [],
  artistList: [],
  albumList: [],
  videoList: [],
  lryicList: [],
  songsList: [],
  anchorList: [],
  userList: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResultAction(state, { payload }) {
      state.keyword = payload.keyword
      state.songList = payload.songList
      state.artistList = payload.artistList
      state.albumList = payload.albumList
      state.videoList = payload.videoList
      state.lryicList = payload.lryicList
      state.songsList = payload.songsList
      state.anchorList = payload.anchorList
      state.userList = payload.userList
    },
    clearSearchResultAction(state) {
      state.keyword = ''
      state.songList = []
      state.artistList = []
      state.albumList = []
      state.videoList = []
      state.lryicList = []
      state.songsList = []
      state.anchorList = []
      state.userList = []
    }
  }
})
export const { setSearchResultAction, clearSearchResultAction } =
  searchSlice.actions
export default searchSlice.reducer
