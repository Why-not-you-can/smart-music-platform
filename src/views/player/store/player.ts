import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getSongDetail,
  getSongLyric,
  getSimiSongs,
  getSimiPlaylist
} from '../service/player'
import { ILyric, parseLyric } from '@/utlis/parse-lyric'
import type { IRootState } from '@/store'

interface IThunkState {
  state: IRootState
}
export const fetchCurrentSongAction = createAsyncThunk<
  void,
  number,
  IThunkState
>('currentSong', (id, { dispatch, getState }) => {
  const playSongList = getState().player.playSongList
  const findIndex = playSongList.findIndex((item) => item.id === id)
  if (findIndex === -1) {
    getSongDetail(id).then((res) => {
      if (!res.songs.length) return
      const song = res.songs[0]
      const newPlaySongList = [...playSongList]
      newPlaySongList.push(song)
      dispatch(changeCurrentSongAction(song))
      dispatch(changePlaySongListAction(newPlaySongList))
      dispatch(changePlaySongIndexAction(newPlaySongList.length - 1))
    })
  } else {
    const song = playSongList[findIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changePlaySongIndexAction(findIndex))
  }
  getSongLyric(id).then((res) => {
    const lyricString = res.lrc.lyric
    const lyrics = parseLyric(lyricString)
    dispatch(changeLyricsAction(lyrics))
  })
})

// 在 player slice 中添加新的 action
export const playLocalDBSongAction = createAsyncThunk<void, any, IThunkState>(
  'playLocalDBSong',
  (song, { dispatch, getState }) => {
    const playSongList = getState().player.playSongList

    // 将本地数据库歌曲转换为播放器期望的格式
    const convertedSong = {
      id: song.id,
      name: song.title, // 将 title 转换为 name
      ar: [{ name: song.artist }], // 将 artist 字符串转换为 ar 数组
      dt: convertDurationToMs(song.duration), // 转换时长格式
      al: { picUrl: song.cover }, // 专辑封面
      url: song.url, // 保留音频URL
      // 保留其他可能需要的字段
      ...song
    }

    const findIndex = playSongList.findIndex(
      (item) => item.id === convertedSong.id
    )

    if (findIndex === -1) {
      const newPlaySongList = [...playSongList, convertedSong]
      dispatch(changeCurrentSongAction(convertedSong))
      dispatch(changePlaySongListAction(newPlaySongList))
      dispatch(changePlaySongIndexAction(newPlaySongList.length - 1))
    } else {
      dispatch(changeCurrentSongAction(convertedSong))
      dispatch(changePlaySongIndexAction(findIndex))
    }
  }
)

// 辅助函数：将 "03:45" 格式转换为毫秒
function convertDurationToMs(duration: string): number {
  if (!duration) return 0
  const parts = duration.split(':')
  if (parts.length === 2) {
    const minutes = parseInt(parts[0])
    const seconds = parseInt(parts[1])
    return (minutes * 60 + seconds) * 1000
  }
  return 0
}

export const changeMusicAction = createAsyncThunk<void, boolean, IThunkState>(
  'changemusic',
  (isNext, { dispatch, getState }) => {
    const player = getState().player
    const playMode = player.playMode
    const songIndex = player.playSongIndex
    const songList = player.playSongList
    let newIndex = songIndex
    if (playMode === 1) {
      newIndex = Math.floor(Math.random() * songList.length)
    } else {
      newIndex = isNext ? songIndex + 1 : songIndex - 1
      if (newIndex > songList.length - 1) newIndex = 0
      if (newIndex < 0) newIndex = songList.length - 1
    }
    const song = songList[newIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changePlaySongIndexAction(newIndex))
    dispatch(changePlayStatusAction(true))

    getSongLyric(song.id).then((res) => {
      const lyricString = res.lrc.lyric
      const lyrics = parseLyric(lyricString)
      dispatch(changeLyricsAction(lyrics))
    })
  }
)
export const fetchSimiSongsAction = createAsyncThunk(
  'simiSongs',
  async (_, { dispatch, getState }) => {
    const state = getState() as any
    const currentSongId = state.player.currentSong?.id
    const songId = currentSongId || 430685507
    const res = await getSimiSongs(songId)
    dispatch(changeSimiSongsAction(res.songs))
  }
)

export const fetchSimiPlayListAction = createAsyncThunk(
  'simiPlaylist',
  async (_, { dispatch, getState }) => {
    const state = getState() as any
    const currentSongId = state.player.currentSong?.id
    const defaultSongId = 9962049402
    let songId = currentSongId || defaultSongId
    let res = await getSimiPlaylist(songId)
    if (!res?.playlists || res.playlists.length === 0) {
      songId = defaultSongId
      res = await getSimiPlaylist(songId)
    }
    dispatch(changeSimiPlayListAction(res?.playlists || []))
  }
)

interface IPlayerState {
  currentSong: any
  lyrics: ILyric[]
  lyricIndex: number
  playSongList: any[]
  playSongIndex: number
  playMode: number
  simiSongs: any[]
  simiPlaylist: any[]
  currentTime: number
  isPlaying: boolean
}
const initialState: IPlayerState = {
  currentSong: {},
  lyrics: [],
  lyricIndex: -1,
  playSongList: [],
  playSongIndex: 0,
  playMode: 0,
  simiSongs: [],
  simiPlaylist: [],
  currentTime: 0,
  isPlaying: false
}
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeCurrentSongAction(state, { payload }) {
      state.currentSong = payload
    },
    changeLyricsAction(state, { payload }) {
      state.lyrics = payload
    },
    changeLyricIndexAction(state, { payload }) {
      state.lyricIndex = payload
    },
    changePlayModeAction(state, { payload }) {
      state.playMode = payload
    },
    changePlaySongIndexAction(state, { payload }) {
      state.playSongIndex = payload
    },
    changePlaySongListAction(state, { payload }) {
      state.playSongList = payload
    },
    changeSimiSongsAction(state, { payload }) {
      state.simiSongs = payload
    },
    changeSimiPlayListAction(state, { payload }) {
      state.simiPlaylist = payload
    },
    clearPlayListAction(state) {
      state.playSongList = []
      state.currentSong = {}
      state.playSongIndex = 0
      state.lyrics = []
      state.lyricIndex = -1
      state.isPlaying = false
    },
    changeCurrentTimeAction(state, { payload }) {
      state.currentTime = payload
    },
    changePlayStatusAction(state, { payload }) {
      state.isPlaying = payload
    }
  }
})
export const {
  changeCurrentSongAction,
  changeLyricsAction,
  changeLyricIndexAction,
  changePlaySongIndexAction,
  changePlaySongListAction,
  changePlayModeAction,
  changeSimiSongsAction,
  changeSimiPlayListAction,
  clearPlayListAction,
  changeCurrentTimeAction,
  changePlayStatusAction
} = playerSlice.actions
export default playerSlice.reducer
