import { convertDurationToMs } from '@/views/player/store/player'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
export const fetchSongsListAction = createAsyncThunk(
  'songslist',
  async (_, { dispatch }) => {
    const res = await axios.get('http://localhost:3001/api/songs')
    const formattedSongs = res.data.data.map((item: any) => ({
      id: item.id,
      name: item.title,
      title: item.title,
      artist: item.artist,
      dt: convertDurationToMs(item.duration),
      duration: item.duration,
      ar: [{ id: 0, name: item.artist }],
      ur: [{ name: item.username }],
      url: `http://localhost:3001${item.url}`,
      cover: item.cover,
      al: { picUrl: item.cover },
      isUserUploaded: true,
      source: 'user_upload',
      userId: item.userId
    }))
    dispatch(changeSongsListAction(formattedSongs))
  }
)

interface ISongsListState {
  songs: any | null
}
const initialState: ISongsListState = {
  songs: null
}
const songslistSlice = createSlice({
  name: 'songslist',
  initialState,
  reducers: {
    changeSongsListAction(state, { payload }) {
      state.songs = { tracks: payload, total: payload.length }
    }
  }
})
export const { changeSongsListAction } = songslistSlice.actions
export default songslistSlice.reducer
